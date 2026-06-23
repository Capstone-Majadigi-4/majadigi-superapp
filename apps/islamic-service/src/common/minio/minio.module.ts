import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MetricsModule } from '../../metrics/metrics.module';

@Module({
  imports: [MetricsModule], 
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
