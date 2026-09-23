import { Module } from '@nestjs/common';
import { PenukaranPoinController } from './penukaran.controller';
import { PenukaranPoinService } from './penukaran.service';

@Module({
  controllers: [PenukaranPoinController],
  providers: [PenukaranPoinService],
  exports: [PenukaranPoinService],
})
export class PenukaranPoinModule {}
