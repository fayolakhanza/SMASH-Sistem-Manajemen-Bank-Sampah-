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
import { KategoriSampahService } from './kategori.service';
import { CreateKategoriSampahDto } from './dto/create-kategori.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { multerStorage, getFileUrl } from '../../common/utils/file-upload.util';

@Controller('api/v1/kategori-sampah')
export class KategoriSampahController {
  constructor(private readonly kategoriService: KategoriSampahService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentMaker('id') appMakerId: string) {
    return this.kategoriService.findAll(appMakerId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async create(
    @CurrentMaker('id') appMakerId: string,
    @Body() dto: CreateKategoriSampahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoUrl = file ? getFileUrl(req, file.filename) : undefined;
    return this.kategoriService.create(appMakerId, dto, fotoUrl);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
  ) {
    return this.kategoriService.findOne(appMakerId, id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async update(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateKategoriSampahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoUrl = file ? getFileUrl(req, file.filename) : undefined;
    return this.kategoriService.update(appMakerId, id, dto, fotoUrl);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
  ) {
    return this.kategoriService.remove(appMakerId, id);
  }
}
