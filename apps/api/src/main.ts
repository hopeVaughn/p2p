import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api'); // <--- this line set the route prefix
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      skipMissingProperties: true,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });
  await app.listen(3000);
}
bootstrap();
