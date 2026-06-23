import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

 app.enableCors({
   origin: [
     'http://localhost:5173',
     'https://majadigi-admin-dashboard.vercel.app',
   ],
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
   credentials: true,
 });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Gateway running on http://localhost:${port}`);
  console.log(`Auth service  → ${process.env.AUTH_SERVICE_URL}`);
}
bootstrap();
