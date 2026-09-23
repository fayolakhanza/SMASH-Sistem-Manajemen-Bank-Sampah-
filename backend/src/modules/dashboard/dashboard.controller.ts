import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @UseGuards(RolesGuard)
  @Roles('NASABAH')
  @HttpCode(HttpStatus.OK)
  async getSummary(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
  ) {
    return this.dashboardService.getNasabahSummary(
      appMakerId,
      user.nasabah.id,
    );
  }

  @Public()
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@CurrentMaker('id') appMakerId: string) {
    return this.dashboardService.getAdminStats(appMakerId);
  }
}
