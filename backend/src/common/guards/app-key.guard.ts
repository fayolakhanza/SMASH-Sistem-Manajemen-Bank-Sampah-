import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { SKIP_APP_KEY } from '../decorators/public.decorator';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAppKey = this.reflector.getAllAndOverride<boolean>(SKIP_APP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAppKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const appKey = request.headers['x-app-key'];

    if (!appKey || typeof appKey !== 'string') {
      throw new UnauthorizedException(
        'Header x-app-key wajib disertakan untuk mengakses endpoint ini.',
      );
    }

    const appMaker = await this.prisma.appMaker.findUnique({
      where: { appKey },
    });

    if (!appMaker) {
      throw new UnauthorizedException(
        'App Key tidak valid atau tidak ditemukan.',
      );
    }

    request.appMaker = appMaker;
    return true;
  }
}
