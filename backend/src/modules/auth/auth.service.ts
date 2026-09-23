import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterNasabahBankDto } from './dto/register-nasabah.dto';
import { RegisterAdminBankDto } from './dto/register-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerNasabah(
    appMakerId: string,
    dto: RegisterNasabahBankDto,
    fotoUrl?: string | null,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: {
        appMakerId,
        username: dto.username,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Username sudah digunakan pada database aplikasi Anda.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const photo = fotoUrl ?? null;

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          appMakerId,
          username: dto.username,
          password: hashedPassword,
          role: Role.NASABAH,
        },
      });

      const newNasabah = await tx.nasabah.create({
        data: {
          userId: newUser.id,
          appMakerId,
          namaNasabah: dto.namaNasabah,
          alamat: dto.alamat,
          telp: dto.telp,
          saldoPoin: 0,
          foto: photo,
        },
      });

      return {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        nasabah: {
          id: newNasabah.id,
          namaNasabah: newNasabah.namaNasabah,
          alamat: newNasabah.alamat,
          telp: newNasabah.telp,
          saldoPoin: newNasabah.saldoPoin,
          foto: newNasabah.foto,
        },
      };
    });

    return {
      message: 'Registrasi nasabah berhasil',
      data: user,
    };
  }

  async registerAdmin(appMakerId: string, dto: RegisterAdminBankDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        appMakerId,
        username: dto.username,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Username sudah digunakan pada database aplikasi Anda.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          appMakerId,
          username: dto.username,
          password: hashedPassword,
          role: Role.ADMIN,
        },
      });

      const newAdmin = await tx.adminBank.create({
        data: {
          userId: newUser.id,
          appMakerId,
          namaUnit: dto.namaUnit,
          namaPengelola: dto.namaPengelola,
          telp: dto.telp,
        },
      });

      return {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        adminBank: {
          id: newAdmin.id,
          namaUnit: newAdmin.namaUnit,
          namaPengelola: newAdmin.namaPengelola,
          telp: newAdmin.telp,
        },
      };
    });

    return {
      message: 'Pendaftaran unit Bank Sampah berhasil',
      data: user,
    };
  }

  async login(appMakerId: string, dto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        appMakerId,
        username: dto.username,
      },
      include: {
        nasabah: true,
        adminBank: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Username atau password salah.');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
      appMakerId,
    });

    return {
      statusCode: 201,
      success: true,
      message: `Login ${user.role} berhasil`,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        nasabah: user.nasabah
          ? {
              id: user.nasabah.id,
              namaNasabah: user.nasabah.namaNasabah,
              alamat: user.nasabah.alamat,
              telp: user.nasabah.telp,
              saldoPoin: user.nasabah.saldoPoin,
              foto: user.nasabah.foto,
            }
          : null,
        adminBank: user.adminBank
          ? {
              id: user.adminBank.id,
              namaUnit: user.adminBank.namaUnit,
              namaPengelola: user.adminBank.namaPengelola,
              telp: user.adminBank.telp,
            }
          : null,
        token,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        nasabah: true,
        adminBank: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    return {
      message: 'Data profile user berhasil diambil',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        nasabah: user.nasabah
          ? {
              id: user.nasabah.id,
              namaNasabah: user.nasabah.namaNasabah,
              alamat: user.nasabah.alamat,
              telp: user.nasabah.telp,
              saldoPoin: user.nasabah.saldoPoin,
              foto: user.nasabah.foto,
            }
          : null,
        adminBank: user.adminBank
          ? {
              id: user.adminBank.id,
              namaUnit: user.adminBank.namaUnit,
              namaPengelola: user.adminBank.namaPengelola,
              telp: user.adminBank.telp,
            }
          : null,
      },
    };
  }
}
