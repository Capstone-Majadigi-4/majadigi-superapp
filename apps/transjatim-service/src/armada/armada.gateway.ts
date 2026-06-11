import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { Armada } from './entities/armada.entity';
import { MetricsService } from '../metrics/metrics.service';

@WebSocketGateway({
  path: '/api/v1/transjatim/armada/live',
  cors: { origin: '*' },
})
export class ArmadaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private readonly logger = new Logger(ArmadaGateway.name);

  constructor(
    @InjectRepository(Armada)
    private readonly armadaRepo: Repository<Armada>,
    private readonly metrics: MetricsService,
  ) {}

  async handleConnection(client: Socket) {
    this.metrics.wsClientsConnected.inc();

    const koridorId = client.handshake.query.koridor_id as string;
    this.logger.log(`Client connected: ${client.id}, koridor_id: ${koridorId}`);

    if (!koridorId) {
      this.logger.warn(`Client ${client.id} disconnected: no koridor_id`);
      client.disconnect();
      return;
    }

    await client.join(`koridor:${koridorId}`);

    const armada = await this.armadaRepo.find({
      where: { koridor_id: koridorId, status: 'aktif' },
    });

    // Update gauge armada aktif untuk koridor ini
    this.metrics.armadaAktif.set({ koridor_id: koridorId }, armada.length);

    client.emit('ARMADA_STATE', {
      koridor_id: koridorId,
      armada: armada.map((a) => ({
        id: a.id,
        kode_bus: a.kode_bus,
        lat: a.lat ? Number.parseFloat(a.lat as any) : null,
        lng: a.lng ? Number.parseFloat(a.lng as any) : null,
        updated_at: a.updated_at,
      })),
    });
  }

  handleDisconnect() {
    this.metrics.wsClientsConnected.dec();
  }

  broadcastLokasi(koridorId: string, armada: Armada) {
    const room = `koridor:${koridorId}`;
    const sockets = this.server.sockets.adapter.rooms.get(room);
    this.logger.log(
      `Broadcasting to room: ${room}, clients: ${sockets?.size ?? 0}`,
    );

    // Hitung setiap update lokasi yang di-broadcast
    this.metrics.armadaLocationUpdates.inc({ koridor_id: koridorId });

    this.server.to(room).emit('ARMADA_BERGERAK', {
      id: armada.id,
      kode_bus: armada.kode_bus,
      lat: armada.lat ? Number.parseFloat(armada.lat as any) : null,
      lng: armada.lng ? Number.parseFloat(armada.lng as any) : null,
      updated_at: armada.updated_at,
    });
  }
}
