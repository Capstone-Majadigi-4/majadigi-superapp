import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { getRoutes } from './routes.config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthMiddleware],
})
export class ProxyModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // 1. AuthMiddleware jalan duluan di semua route
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });

    // 2. Proxy ke masing-masing service
    const routes = getRoutes(process.env);

    routes.forEach((route) => {
      consumer
        .apply(
          createProxyMiddleware({
            target: route.target,
            changeOrigin: true,
            ws: true,
           onError: (err, req, res) => {
            console.error(`[PROXY ERROR] Gagal akses ${req.url}: ${err.message}`);
              const response = res as import('node:http').ServerResponse;
              response.writeHead(502, {
                'Content-Type': 'application/json',
              });
              response.end(
                JSON.stringify({
                  status: 'error',
                  message: `Service tidak tersedia: ${route.path}`,
                  error: 'BAD_GATEWAY',
                  code: 502,
                }),
              );
            },
          }),
        )
        .forRoutes(
          { path: route.path, method: RequestMethod.ALL },
          { path: `${route.path}/*path`, method: RequestMethod.ALL },
        );
    });
  }
}