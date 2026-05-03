import { Module } from '@nestjs/common';
import { HalteService } from './halte.service';
import { HalteController } from './halte.controller';

@Module({
  controllers: [HalteController],
  providers: [HalteService],
})
export class HalteModule {}
