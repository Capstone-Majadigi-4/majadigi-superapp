import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Antrean } from './entities/antrean.entity';
import { Dokter } from './entities/dokter.entity';
import { JadwalDokter } from './entities/jadwal-dokter.entity';
import { AntreanService } from './antrean.service';
import { AntreanController } from './antrean.controller';
import { AntreanGateway } from './antrean.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Antrean, Dokter, JadwalDokter])],
  providers: [AntreanService, AntreanGateway],
  controllers: [AntreanController],
})
export class AntreanModule {}
