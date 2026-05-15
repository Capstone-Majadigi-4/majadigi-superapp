import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Koridor } from '../koridor/entities/koridor.entity';
import { Halte } from '../halte/entities/halte.entity';
import { Armada } from '../armada/entities/armada.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Koridor, Halte, Armada])],
  providers: [SeederService],
})
export class SeederModule {}
