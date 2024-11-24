import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from "@nestjs/common";
import * as path from 'node:path';
import { UnexpectedExceptionFilter } from "./http-exception.filter";
dotenv.config();

if (process.env.NODE_ENV === 'local') {
  Logger.log('로컬 환경에서 작동 중');
  dotenv.config({ path: path.join(__dirname, '../.env-local') });
} else if (process.env.NODE_ENV === 'dev') {
  Logger.log('개발 환경에서 작동 중');
  dotenv.config({ path: path.join(__dirname, '../.env-dev') });
}

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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
