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
import { HadiahService } from './hadiah.service';
import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { multerStorage, getFileUrl } from '../../common/utils/file-upload.util';

@Controller('api/v1/hadiah')
export class HadiahController {
  constructor(private readonly hadiahService: HadiahService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentMaker('id') appMakerId: string) {
    return this.hadiahService.findAll(appMakerId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async create(
    @CurrentMaker('id') appMakerId: string,
    @Body() dto: CreateHadiahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoUrl = file ? getFileUrl(req, file.filename) : undefined;
    return this.hadiahService.create(appMakerId, dto, fotoUrl);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
  ) {
    return this.hadiahService.findOne(appMakerId, id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async update(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateHadiahDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fotoUrl = file ? getFileUrl(req, file.filename) : undefined;
    return this.hadiahService.update(appMakerId, id, dto, fotoUrl);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMaker('id') appMakerId: string,
    @Param('id') id: string,
  ) {
    return this.hadiahService.remove(appMakerId, id);
  }
}
