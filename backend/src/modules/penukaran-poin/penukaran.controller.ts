import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PenukaranPoinService } from './penukaran.service';
import {
  CreatePenukaranPoinDto,
  UpdateStatusPenukaranDto,
} from './dto/create-penukaran.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/v1/penukaran-poin')
export class PenukaranPoinController {
  constructor(private readonly penukaranService: PenukaranPoinService) {}

  @Post('tukar')
  @UseGuards(RolesGuard)
  @Roles('NASABAH')
  @HttpCode(HttpStatus.CREATED)
  async tukarPoin(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
    @Body() dto: CreatePenukaranPoinDto,
  ) {
    return this.penukaranService.tukarPoin(
      appMakerId,
      user.nasabah.id,
      dto,
    );
  }

  @Get('my-penukaran')
  @UseGuards(RolesGuard)
  @Roles('NASABAH')
  @HttpCode(HttpStatus.OK)
  async getMyPenukaran(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
  ) {
    return this.penukaranService.getMyPenukaran(
      appMakerId,
      user.nasabah.id,
    );
  }

  @Get('admin/list')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getAdminList(
    @CurrentMaker('id') appMakerId: string,
    @Query('bulan') bulan?: string,
  ) {
    return this.penukaranService.getAdminList(appMakerId, bulan);
  }

  @Put('admin/status/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStatusPenukaranDto,
  ) {
    return this.penukaranService.updateStatus(appMakerId, id, dto);
  }

  @Get('nota/:id')
  @HttpCode(HttpStatus.OK)
  async getNota(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.penukaranService.getNota(appMakerId, id, user);
  }
}
