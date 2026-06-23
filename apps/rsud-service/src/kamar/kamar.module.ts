import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruangan } from './entities/ruangan.entity';
import { KamarService } from './kamar.service';
import { KamarController } from './kamar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ruangan])],
  providers: [KamarService],
  controllers: [KamarController],
})
export class KamarModule {}
