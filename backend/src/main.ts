import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Di Vercel gunakan /tmp/uploads, di lokal gunakan ./uploads
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const uploadDir = isProduction
    ? '/tmp/uploads'
    : join(__dirname, '..', 'uploads');

  // Buat subdirektori yang diperlukan
  ['', 'nasabah', 'kategori', 'hadiah'].forEach((sub) => {
    const dir = join(uploadDir, sub);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Sajikan file statis (foto profil, bukti sampah, gambar kategori, dll.)
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
  logger.log(`SMASH Backend is running on port ${port}`);
}
bootstrap();

