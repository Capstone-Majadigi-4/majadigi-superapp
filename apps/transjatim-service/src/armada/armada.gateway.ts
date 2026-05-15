import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { Armada } from './entities/armada.entity';

@WebSocketGateway({
  path: '/api/v1/transjatim/armada/live',
  cors: { origin: '*' },
})
export class ArmadaGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ArmadaGateway.name);

  constructor(
    @InjectRepository(Armada)
    private readonly armadaRepo: Repository<Armada>,
  ) {}

  async handleConnection(client: Socket) {
    const koridorId = client.handshake.query.koridor_id as string;
    this.logger.log(`Client connected: ${client.id}, koridor_id: ${koridorId}`);

    if (!koridorId) {
      this.logger.warn(`Client ${client.id} disconnected: no koridor_id`);
      client.disconnect();
      return;
    }

    await client.join(`koridor:${koridorId}`);
    const rooms = Array.from(client.rooms);
    this.logger.log(`Client ${client.id} joined rooms: ${rooms.join(', ')}`);

    const armada = await this.armadaRepo.find({
      where: { koridor_id: koridorId, status: 'aktif' },
    });

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

  broadcastLokasi(koridorId: string, armada: Armada) {
    const room = `koridor:${koridorId}`;
    const sockets = this.server.sockets.adapter.rooms.get(room);
    this.logger.log(`Broadcasting to room: ${room}, clients in room: ${sockets?.size ?? 0}`);

    this.server.to(room).emit('ARMADA_BERGERAK', {
      id: armada.id,
      kode_bus: armada.kode_bus,
      lat: armada.lat ? Number.parseFloat(armada.lat as any) : null,
      lng: armada.lng ? Number.parseFloat(armada.lng as any) : null,
      updated_at: armada.updated_at,
    });
  }
}
