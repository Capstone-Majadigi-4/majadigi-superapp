import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poli } from '../poli/entities/poli.entity';
import { Dokter } from '../antrean/entities/dokter.entity';
import { JadwalDokter } from '../antrean/entities/jadwal-dokter.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poli, Dokter, JadwalDokter])],
  providers: [SeederService],
})
export class SeederModule {}
