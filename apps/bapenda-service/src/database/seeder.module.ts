import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { KendaraanNjkb } from '../modules/bapenda/entities/kendaraan-njkb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KendaraanNjkb])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
