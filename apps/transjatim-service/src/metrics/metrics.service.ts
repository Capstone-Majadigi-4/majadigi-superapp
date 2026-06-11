import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Registry,
  Counter,
  Histogram,
  Gauge,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  readonly registry = new Registry();

  readonly httpRequestTotal = new Counter({
    name: 'transjatim_http_requests_total',
    help: 'Total HTTP requests to transjatim-service',
    labelNames: ['method', 'path', 'status'],
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: 'transjatim_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [this.registry],
  });

  // Jumlah client yang sedang pantau live tracking
  readonly wsClientsConnected = new Gauge({
    name: 'transjatim_websocket_clients_connected',
    help: 'Jumlah WebSocket client yang sedang connect ke live tracking',
    registers: [this.registry],
  });

  // Total update lokasi bus yang di-broadcast (per koridor)
  readonly armadaLocationUpdates = new Counter({
    name: 'transjatim_armada_location_updates_total',
    help: 'Total broadcast lokasi armada yang dikirim ke client',
    labelNames: ['koridor_id'],
    registers: [this.registry],
  });

  // Jumlah armada aktif per koridor saat ini
  readonly armadaAktif = new Gauge({
    name: 'transjatim_armada_aktif_total',
    help: 'Jumlah armada aktif per koridor',
    labelNames: ['koridor_id'],
    registers: [this.registry],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });
  }
}
