import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Halte } from './entities/halte.entity';
import { HalteService } from './halte.service';
import { HalteController } from './halte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Halte])],
  providers: [HalteService],
  controllers: [HalteController],
  exports: [HalteService],
})
export class HalteModule {}
