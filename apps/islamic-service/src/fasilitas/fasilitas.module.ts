import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fasilitas } from './entities/fasilitas.entity';
import { BookingFasilitas } from './entities/booking.entity';
import { FasilitasService } from './fasilitas.service';
import { FasilitasController } from './fasilitas.controller';
import { FasilitasAdminController } from './fasilitas-admin.controller';
import { MetricsModule } from '../metrics/metrics.module';
import { MinioModule } from '../common/minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fasilitas, BookingFasilitas]),
  MetricsModule,
  MinioModule
],
  providers: [FasilitasService],
  controllers: [FasilitasController, FasilitasAdminController],
})
export class FasilitasModule {}
