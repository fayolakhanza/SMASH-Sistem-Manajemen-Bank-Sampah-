import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Cache app instance untuk menghindari cold start berulang di Vercel
let cachedApp: NestExpressApplication;

async function createNestApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });

  // Buat direktori upload sementara di /tmp (ephemeral di Vercel)
  const uploadDir = '/tmp/uploads';
  ['', 'nasabah', 'kategori', 'hadiah'].forEach((sub) => {
    const dir = join(uploadDir, sub);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Sajikan file upload statis dari /tmp/uploads
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });

  // CORS — izinkan Vercel frontend dan semua origin
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-app-key',
    credentials: false,
  });

  // Validasi global payload
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  cachedApp = app;
  return app;
}

// Vercel Serverless Function handler
export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const app = await createNestApp();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
}
