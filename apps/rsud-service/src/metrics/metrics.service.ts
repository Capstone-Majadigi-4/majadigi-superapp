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
    name: 'rsud_http_requests_total',
    help: 'Total HTTP requests to rsud-service',
    labelNames: ['method', 'path', 'status'],
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: 'rsud_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [this.registry],
  });

  // Metric khusus RSUD — jumlah antrian aktif saat ini
  readonly antreanAktif = new Gauge({
    name: 'rsud_antrean_aktif_total',
    help: 'Jumlah antrian dengan status menunggu saat ini',
    labelNames: ['poli_id'],
    registers: [this.registry],
  });

  // Metric khusus RSUD — total WebSocket client yang connect
  readonly wsClientsConnected = new Gauge({
    name: 'rsud_websocket_clients_connected',
    help: 'Jumlah WebSocket client yang sedang connect ke live queue',
    registers: [this.registry],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });
  }
}
