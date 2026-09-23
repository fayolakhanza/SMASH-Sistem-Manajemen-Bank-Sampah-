import { Module } from '@nestjs/common';
import { SetorSampahController } from './setor.controller';
import { SetorSampahService } from './setor.service';

@Module({
  controllers: [SetorSampahController],
  providers: [SetorSampahService],
  exports: [SetorSampahService],
})
export class SetorSampahModule {}
