import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { MakerModule } from './modules/maker/maker.module';
import { AuthModule } from './modules/auth/auth.module';
import { NasabahModule } from './modules/nasabah/nasabah.module';
import { KategoriSampahModule } from './modules/kategori-sampah/kategori.module';
import { SetorSampahModule } from './modules/setor-sampah/setor.module';
import { HadiahModule } from './modules/hadiah/hadiah.module';
import { PenukaranPoinModule } from './modules/penukaran-poin/penukaran.module';
import { RekapitulasiModule } from './modules/rekapitulasi/rekapitulasi.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

import { AppKeyGuard } from './common/guards/app-key.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MakerModule,
    AuthModule,
    NasabahModule,
    KategoriSampahModule,
    SetorSampahModule,
    HadiahModule,
    PenukaranPoinModule,
    RekapitulasiModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
