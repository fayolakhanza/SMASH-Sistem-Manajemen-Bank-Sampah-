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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SetorSampahService } from './setor.service';
import { CreateSetorSampahDto } from './dto/create-setor.dto';
import { VerifySetorSampahDto } from './dto/verify-setor.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  nasabahBuktiStorage,
  getNasabahBuktiUrl,
} from '../../common/utils/file-upload.util';

@Controller('api/v1/setor-sampah')
export class SetorSampahController {
  constructor(private readonly setorService: SetorSampahService) {}

  @Post('pengajuan')
  @UseGuards(RolesGuard)
  @Roles('NASABAH')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('fotoBukti', { storage: nasabahBuktiStorage }))
  async createPengajuan(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateSetorSampahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoBuktiUrl = file
      ? getNasabahBuktiUrl(req, file.filename)
      : undefined;
    return this.setorService.createPengajuan(
      appMakerId,
      user.nasabah.id,
      dto,
      fotoBuktiUrl,
    );
  }

  @Get('my-setor')
  @UseGuards(RolesGuard)
  @Roles('NASABAH')
  @HttpCode(HttpStatus.OK)
  async getMySetor(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
    @Query('bulan') bulan?: string,
  ) {
    return this.setorService.getMySetor(appMakerId, user.nasabah.id, bulan);
  }

  @Get('admin/list')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getAdminList(
    @CurrentMaker('id') appMakerId: string,
    @Query('status') status?: string,
    @Query('bulan') bulan?: string,
  ) {
    return this.setorService.getAdminList(appMakerId, status, bulan);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getDetail(
    @CurrentMaker('id') appMakerId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.setorService.getDetail(appMakerId, id, user);
  }

  @Put('admin/verify/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async verify(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
    @Body() dto: VerifySetorSampahDto,
  ) {
    return this.setorService.verify(appMakerId, id, dto);
  }
}
