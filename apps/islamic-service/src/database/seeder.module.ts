import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fasilitas } from '../fasilitas/entities/fasilitas.entity';
import { Acara } from '../acara/entities/acara.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fasilitas, Acara])],
  providers: [SeederService],
})
export class SeederModule {}
