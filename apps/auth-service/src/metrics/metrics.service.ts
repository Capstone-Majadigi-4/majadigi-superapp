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
    name: 'auth_http_requests_total',
    help: 'Total HTTP requests ke auth-service',
    labelNames: ['method', 'path', 'status'],
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: 'auth_http_request_duration_seconds',
    help: 'Durasi HTTP request dalam detik',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [this.registry],
  });

  readonly authLoginTotal = new Counter({
    name: 'auth_login_total',
    help: 'Total percobaan login',
    labelNames: ['status'], // success | failed
    registers: [this.registry],
  });

  readonly authRegisterTotal = new Counter({
    name: 'auth_register_total',
    help: 'Total percobaan registrasi',
    labelNames: ['status'], // success | conflict
    registers: [this.registry],
  });

  readonly authRefreshTotal = new Counter({
    name: 'auth_token_refresh_total',
    help: 'Total percobaan refresh token',
    labelNames: ['status'], // success | failed
    registers: [this.registry],
  });

  readonly authLogoutTotal = new Counter({
    name: 'auth_logout_total',
    help: 'Total logout berhasil',
    registers: [this.registry],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });
  }
}
