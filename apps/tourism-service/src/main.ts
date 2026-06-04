import { NestFactory }
from '@nestjs/core';

import { ValidationPipe }
from '@nestjs/common';

import { AppModule }
from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  app.setGlobalPrefix(
    'api/v1',
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3007);

  console.log(
    'Tourism Service running on port 3007',
  );
}

bootstrap();