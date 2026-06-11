import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Registry,
  Counter,
  Histogram,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  readonly registry = new Registry();

  readonly httpRequestTotal = new Counter({
    name: 'islamic_http_requests_total',
    help: 'Total HTTP requests to islamic-service',
    labelNames: ['method', 'path', 'status'],
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: 'islamic_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [this.registry],
  });

  readonly acaraPendaftaranTotal = new Counter({
    name: 'islamic_acara_pendaftaran_total',
    help: 'Total pendaftaran acara berhasil',
    registers: [this.registry],
  });

  readonly fasilitasBookingTotal = new Counter({
    name: 'islamic_fasilitas_booking_total',
    help: 'Total booking fasilitas berhasil (status: pending_review)',
    labelNames: ['fasilitas_id'],
    registers: [this.registry],
  });

  readonly minioUploadTotal = new Counter({
    name: 'islamic_minio_upload_total',
    help: 'Total upload file ke MinIO',
    labelNames: ['status'],
    registers: [this.registry],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });
  }
}
