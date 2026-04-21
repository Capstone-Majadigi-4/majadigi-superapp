import { Module } from '@nestjs/common';
import { PoliService } from './poli.service';
import { PoliController } from './poli.controller';

@Module({
  controllers: [PoliController],
  providers: [PoliService],
})
export class PoliModule {}
