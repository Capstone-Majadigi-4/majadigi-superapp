import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      transform: true,

      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  const config =
    new DocumentBuilder()
      .setTitle('Sinaker Service')
      .setDescription(
        'Majadigi Sinaker API',
      )
      .setVersion('1.0')
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'docs',
    app,
    document,
  );

  await app.listen(
    process.env.PORT || 3010,
  );

  console.log(
    `Sinaker Service running on port ${
      process.env.PORT || 3010
    }`,
  );
}

bootstrap();