import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterNasabahBankDto } from './dto/register-nasabah.dto';
import { RegisterAdminBankDto } from './dto/register-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { multerStorage, getFileUrl } from '../../common/utils/file-upload.util';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('nasabah/register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('foto', { storage: multerStorage }))
  async registerNasabah(
    @CurrentMaker('id') appMakerId: string,
    @Body() dto: RegisterNasabahBankDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    let fotoUrl: string | null = null;
    if (file) {
      fotoUrl = getFileUrl(req, file.filename) || null;
    } else if (dto.foto && typeof dto.foto === 'string' && dto.foto.trim() !== '') {
      fotoUrl = dto.foto.trim();
    }
    return this.authService.registerNasabah(appMakerId, dto, fotoUrl);
  }

  @Public()
  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(
    @CurrentMaker('id') appMakerId: string,
    @Body() dto: RegisterAdminBankDto,
  ) {
    return this.authService.registerAdmin(appMakerId, dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(
    @CurrentMaker('id') appMakerId: string,
    @Body() dto: LoginUserDto,
  ) {
    return this.authService.login(appMakerId, dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }
}
