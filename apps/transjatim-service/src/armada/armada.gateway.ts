import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
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

  constructor(
    @InjectRepository(Armada)
    private readonly armadaRepo: Repository<Armada>,
  ) {}

  async handleConnection(client: Socket) {
    const koridorId = client.handshake.query.koridor_id as string;
    if (!koridorId) {
      client.disconnect();
      return;
    }

    client.join(`koridor:${koridorId}`);

    // Kirim snapshot posisi armada saat client connect
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
    this.server.to(`koridor:${koridorId}`).emit('ARMADA_BERGERAK', {
      id: armada.id,
      kode_bus: armada.kode_bus,
      lat: armada.lat ? Number.parseFloat(armada.lat as any) : null,
      lng: armada.lng ? Number.parseFloat(armada.lng as any) : null,
      updated_at: armada.updated_at,
    });
  }
}
