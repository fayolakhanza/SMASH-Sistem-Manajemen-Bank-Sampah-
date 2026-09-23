import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RekapitulasiService } from './rekapitulasi.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';

@Controller('api/v1/rekapitulasi')
export class RekapitulasiController {
  constructor(private readonly rekapitulasiService: RekapitulasiService) {}

  @Get('bulanan')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getRekapitulasiBulanan(
    @CurrentMaker('id') appMakerId: string,
    @Query('bulan') bulan?: string,
  ) {
    return this.rekapitulasiService.getRekapitulasiBulanan(appMakerId, bulan);
  }
}
