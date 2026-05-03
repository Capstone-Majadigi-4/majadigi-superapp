import { Module } from '@nestjs/common';
import { FasilitasService } from './fasilitas.service';
import { FasilitasController } from './fasilitas.controller';

@Module({
  controllers: [FasilitasController],
  providers: [FasilitasService],
})
export class FasilitasModule {}
