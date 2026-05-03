import { Module } from '@nestjs/common';
import { PendaftaranService } from './pendaftaran.service';
import { PendaftaranController } from './pendaftaran.controller';

@Module({
  controllers: [PendaftaranController],
  providers: [PendaftaranService],
})
export class PendaftaranModule {}
