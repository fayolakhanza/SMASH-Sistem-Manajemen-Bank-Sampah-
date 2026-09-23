import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { MakerService } from './maker.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
import { Public, SkipAppKey } from '../../common/decorators/public.decorator';
import { CurrentMaker } from '../../common/decorators/current-maker.decorator';

@Controller('api/v1/maker')
export class MakerController {
  constructor(private readonly makerService: MakerService) {}

  @Public()
  @SkipAppKey()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterAppMakerDto) {
    return this.makerService.register(dto);
  }

  @Public()
  @SkipAppKey()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginAppMakerDto) {
    return this.makerService.login(dto);
  }

  @Public()
  @Get('profile')
  async getProfile(@CurrentMaker('id') makerId: string) {
    return this.makerService.getProfile(makerId);
  }

  @Public()
  @SkipAppKey()
  @Get('check-key')
  async checkKey(@Query('email') email: string) {
    return this.makerService.checkKey(email);
  }
}
