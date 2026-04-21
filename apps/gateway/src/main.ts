import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Gateway running on http://localhost:${port}`);
  console.log(`Auth service  → ${process.env.AUTH_SERVICE_URL}`);
}
bootstrap();
