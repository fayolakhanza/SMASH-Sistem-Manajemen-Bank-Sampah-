import { Module } from '@nestjs/common';
import { NasabahController } from './nasabah.controller';
import { NasabahService } from './nasabah.service';

@Module({
  controllers: [NasabahController],
  providers: [NasabahService],
  exports: [NasabahService],
})
export class NasabahModule {}
