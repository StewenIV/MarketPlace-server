import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'storage'));
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });

  
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
