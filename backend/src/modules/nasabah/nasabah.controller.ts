import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { multerStorage, getFileUrl } from '../../common/utils/file-upload.util';

@Controller('api/v1/admin/nasabah')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class NasabahController {
  constructor(private readonly nasabahService: NasabahService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentMaker('id') appMakerId: string) {
    return this.nasabahService.findAll(appMakerId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async create(
    @CurrentMaker('id') appMakerId: string,
    @Body() dto: CreateNasabahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoUrl = file ? getFileUrl(req, file.filename) : undefined;
    return this.nasabahService.create(appMakerId, dto, fotoUrl);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
  ) {
    return this.nasabahService.findOne(appMakerId, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async update(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNasabahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoUrl = file ? getFileUrl(req, file.filename) : undefined;
    return this.nasabahService.update(appMakerId, id, dto, fotoUrl);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
  ) {
    return this.nasabahService.remove(appMakerId, id);
  }
}
