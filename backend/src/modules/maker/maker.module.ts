import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MakerController } from './maker.controller';
import { MakerService } from './maker.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'super-secret-jwt-key-for-bank-sampah-ukk-2026'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN', '7d')) as any,
        },
      }),
    }),
  ],
  controllers: [MakerController],
  providers: [MakerService],
  exports: [MakerService],
})
export class MakerModule {}
