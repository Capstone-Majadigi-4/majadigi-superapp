import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poli } from './entities/poli.entity';
import { PoliService } from './poli.service';
import { PoliController } from './poli.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poli])],
  providers: [PoliService],
  controllers: [PoliController],
  exports: [PoliService],
})
export class PoliModule {}
