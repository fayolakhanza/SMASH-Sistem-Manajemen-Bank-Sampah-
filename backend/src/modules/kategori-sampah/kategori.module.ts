import { Module } from '@nestjs/common';
import { KategoriSampahController } from './kategori.controller';
import { KategoriSampahService } from './kategori.service';

@Module({
  controllers: [KategoriSampahController],
  providers: [KategoriSampahService],
  exports: [KategoriSampahService],
})
export class KategoriSampahModule {}
