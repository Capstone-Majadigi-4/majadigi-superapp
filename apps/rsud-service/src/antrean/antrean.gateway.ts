import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { Antrean } from './entities/antrean.entity';

@WebSocketGateway({ path: '/api/v1/rsud/antrean/live', cors: { origin: '*' } })
export class AntreanGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  constructor(
    @InjectRepository(Antrean) private readonly antreanRepo: Repository<Antrean>,
  ) {}

  async handleConnection(client: Socket) {
    const poliId = client.handshake.query.poli_id as string;
    if (!poliId) return;

    client.join(`poli:${poliId}`);
    const antrean = await this.antreanRepo.find({
      where: { poli_id: poliId, status: 'menunggu' },
      order: { nomor_antrean: 'ASC' },
      relations: ['dokter'],
    });

    client.emit('QUEUE_STATE', {
      poli_id: poliId,
      antrean: antrean.map((a) => ({
        id: a.id,
        nomor_antrean: a.nomor_antrean,
        estimasi_jam: a.estimasi_jam,
        dokter: a.dokter?.nama,
        status: a.status,
      })),
    });
  }

  broadcastDipanggil(poliId: string, antrean: Antrean) {
    this.server.to(`poli:${poliId}`).emit('ANTREAN_DIPANGGIL', {
      event: 'ANTREAN_DIPANGGIL',
      nomor_dipanggil: antrean.nomor_antrean,
      poli: antrean.poli?.nama,
      timestamp: antrean.dipanggil_at,
    });
  }

  broadcastAntreanBaru(poliId: string, antrean: Antrean) {
    this.server.to(`poli:${poliId}`).emit('ANTREAN_BARU', {
      id: antrean.id,
      nomor_antrean: antrean.nomor_antrean,
      estimasi_jam: antrean.estimasi_jam,
      dokter: antrean.dokter?.nama,
      status: antrean.status,
    });
  }
}
