import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from "@nestjs/common";
import * as path from 'node:path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UnexpectedExceptionFilter } from "./http-exception.filter";

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'local'
      ? '.env-local'
      : process.env.NODE_ENV === 'production'
        ? '.env-production'
        : '.env-dev',
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new UnexpectedExceptionFilter());
  app.enableCors({
    origin: '*', // Or specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  // app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('OOTD API')
    .setDescription('OOTD API description')
    .setVersion('1.0')
    .addTag('ootd')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
