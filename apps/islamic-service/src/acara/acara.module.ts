import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acara } from './entities/acara.entity';
import { PendaftaranAcara } from './entities/pendaftaran.entity';
import { AcaraService } from './acara.service';
import { AcaraController } from './acara.controller';
import { AcaraAdminController } from './acara-admin.controller';
import { MetricsModule } from '../metrics/metrics.module';
import { MinioModule } from '../common/minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Acara, PendaftaranAcara]),
    MetricsModule,
    MinioModule,
  ],
  providers: [AcaraService],
  controllers: [AcaraController, AcaraAdminController],
})
export class AcaraModule {}
