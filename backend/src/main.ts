import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Ensure upload directories exist in production container
  const uploadDir = join(__dirname, '..', 'uploads');
  ['', 'nasabah', 'kategori', 'hadiah'].forEach((sub) => {
    const dir = join(uploadDir, sub);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Serve static uploaded files
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-app-key',
  });

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`SMASH Backend is running on port ${port} (0.0.0.0:${port})`);
}
bootstrap();
