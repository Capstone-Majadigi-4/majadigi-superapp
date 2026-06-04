import { NestFactory }
from '@nestjs/core';

import {
  ValidationPipe,
} from '@nestjs/common';

import { AppModule }
from './app.module';

import { HttpExceptionFilter }
from './common/filters/http-exception.filter';

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

      forbidNonWhitelisted: true,

      transform: true,

      transformOptions: {
        enableImplicitConversion:
          true,
      },
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  app.enableCors({
    origin: '*',

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],

    allowedHeaders: '*',
  });

  await app.listen(3006);

  console.log(
    'Emergency Service running on port 3006',
  );
}

bootstrap();