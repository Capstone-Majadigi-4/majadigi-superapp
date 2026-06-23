import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Koridor } from './entities/koridor.entity';
import { KoridorService } from './koridor.service';
import { KoridorController } from './koridor.controller';
import { HalteModule } from '../halte/halte.module';

@Module({
  imports: [TypeOrmModule.forFeature([Koridor]), HalteModule],
  providers: [KoridorService],
  controllers: [KoridorController],
  exports: [KoridorService],
})
export class KoridorModule {}
