import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Antrean } from './entities/antrean.entity';



@WebSocketGateway({path: '/api/v1/rsud/antrean/live', cors: { origin: '*' }})
export class AntreanGateway implements OnGatewayConnection {
    @WebSocketServer() server!: Server;

    handleConnection(client: Socket) {
        const poliId = client.handshake.query.poli_id as string;

        if(poliId) client.join(`poli:${poliId}`);
    }

    broadcastDipanggil(poliId: string, antrean: Antrean) {
        this.server.to(`poli:${poliId}`).emit('ANTREAN_DIPANGGIL', {
            id: antrean.id,
            nomor_antrean: antrean.nomor_antrean,
            poli_id: antrean.poli_id,
            status: antrean.status,
            dipanggil_at: antrean.dipanggil_at,
        });
    }
}