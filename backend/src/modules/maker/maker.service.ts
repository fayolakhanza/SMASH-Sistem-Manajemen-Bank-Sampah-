import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';

@Injectable()
export class MakerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterAppMakerDto) {
    const existing = await this.prisma.appMaker.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email sudah terdaftar sebagai App Maker.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const appMaker = await this.prisma.appMaker.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        namaSiswa: dto.namaSiswa,
        kelas: dto.kelas,
        namaApp: dto.namaApp,
      },
    });

    const token = this.jwtService.sign({
      sub: appMaker.id,
      email: appMaker.email,
      type: 'APP_MAKER',
    });

    return {
      message:
        'Registrasi App Maker berhasil! Simpan appKey berikut untuk dimasukkan di header x-app-key pada setiap request API frontend.',
      data: {
        id: appMaker.id,
        email: appMaker.email,
        namaSiswa: appMaker.namaSiswa,
        kelas: appMaker.kelas,
        namaApp: appMaker.namaApp,
        appKey: appMaker.appKey,
        token,
        createdAt: appMaker.createdAt.toISOString(),
      },
    };
  }

  async login(dto: LoginAppMakerDto) {
    const appMaker = await this.prisma.appMaker.findUnique({
      where: { email: dto.email },
    });

    if (!appMaker) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const isMatch = await bcrypt.compare(dto.password, appMaker.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const token = this.jwtService.sign({
      sub: appMaker.id,
      email: appMaker.email,
      type: 'APP_MAKER',
    });

    return {
      message: 'Login App Maker berhasil',
      data: {
        id: appMaker.id,
        email: appMaker.email,
        namaSiswa: appMaker.namaSiswa,
        kelas: appMaker.kelas,
        namaApp: appMaker.namaApp,
        appKey: appMaker.appKey,
        token,
      },
    };
  }

  async getProfile(appMakerId: string) {
    const appMaker = await this.prisma.appMaker.findUnique({
      where: { id: appMakerId },
    });

    if (!appMaker) {
      throw new NotFoundException('App Maker tidak ditemukan.');
    }

    const [totalNasabah, totalKategoriSampah, totalTransaksiSetor, totalHadiah] =
      await Promise.all([
        this.prisma.nasabah.count({ where: { appMakerId } }),
        this.prisma.kategoriSampah.count({ where: { appMakerId } }),
        this.prisma.setorSampah.count({ where: { appMakerId } }),
        this.prisma.hadiah.count({ where: { appMakerId } }),
      ]);

    return {
      message: 'Data profile App Maker berhasil diambil',
      data: {
        id: appMaker.id,
        email: appMaker.email,
        namaSiswa: appMaker.namaSiswa,
        kelas: appMaker.kelas,
        namaApp: appMaker.namaApp,
        appKey: appMaker.appKey,
        stats: {
          totalNasabah,
          totalKategoriSampah,
          totalTransaksiSetor,
          totalHadiah,
        },
      },
    };
  }

  async checkKey(email: string) {
    if (!email) {
      throw new BadRequestException('Query parameter email wajib disertakan.');
    }

    const appMaker = await this.prisma.appMaker.findUnique({
      where: { email },
    });

    if (!appMaker) {
      throw new NotFoundException('Akun App Maker dengan email tersebut tidak ditemukan.');
    }

    return {
      message: 'App Key ditemukan',
      data: {
        email: appMaker.email,
        namaSiswa: appMaker.namaSiswa,
        namaApp: appMaker.namaApp,
        appKey: appMaker.appKey,
      },
    };
  }
}
