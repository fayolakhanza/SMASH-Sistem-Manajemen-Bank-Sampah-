import { Module } from '@nestjs/common';
import { RekapitulasiController } from './rekapitulasi.controller';
import { RekapitulasiService } from './rekapitulasi.service';

@Module({
  controllers: [RekapitulasiController],
  providers: [RekapitulasiService],
  exports: [RekapitulasiService],
})
export class RekapitulasiModule {}
