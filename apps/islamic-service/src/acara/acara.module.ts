import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acara } from './entities/acara.entity';
import { PendaftaranAcara } from './entities/pendaftaran.entity';
import { AcaraService } from './acara.service';
import { AcaraController } from './acara.controller';
import { AcaraAdminController } from './acara-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Acara, PendaftaranAcara])],
  providers: [AcaraService],
  controllers: [AcaraController, AcaraAdminController],
})
export class AcaraModule {}
