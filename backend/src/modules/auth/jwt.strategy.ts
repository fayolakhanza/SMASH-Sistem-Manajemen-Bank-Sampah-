import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'super-secret-jwt-key-for-bank-sampah-ukk-2026',
      ),
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token tidak valid.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        nasabah: true,
        adminBank: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    return user;
  }
}
