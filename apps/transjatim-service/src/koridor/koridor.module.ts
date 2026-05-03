import { Module } from '@nestjs/common';
import { KoridorService } from './koridor.service';
import { KoridorController } from './koridor.controller';

@Module({
  controllers: [KoridorController],
  providers: [KoridorService],
})
export class KoridorModule {}
