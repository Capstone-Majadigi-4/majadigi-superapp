import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tiket } from './entities/tiket.entity';
import { TiketService } from './tiket.service';
import { TiketController } from './tiket.controller';
import { KoridorModule } from '../koridor/koridor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tiket]), KoridorModule],
  providers: [TiketService],
  controllers: [TiketController],
})
export class TiketModule {}
