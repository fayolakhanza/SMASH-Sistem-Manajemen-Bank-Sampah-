import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Akses ditolak: Token otentikasi tidak valid atau belum disertakan.',
        )
      );
    }

    const request = context.switchToHttp().getRequest();
    if (request.appMaker && user.appMakerId !== request.appMaker.id) {
      throw new UnauthorizedException(
        'Akses ditolak: Token tidak sesuai dengan App Key (Tenant) yang digunakan.',
      );
    }

    return user;
  }
}
