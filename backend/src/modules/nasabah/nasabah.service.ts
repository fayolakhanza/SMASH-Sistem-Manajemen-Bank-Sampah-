import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { Role } from '@prisma/client';

@Injectable()
export class NasabahService {
  constructor(private prisma: PrismaService) {}

  async findAll(appMakerId: string) {
    const nasabahs = await this.prisma.nasabah.findMany({
      where: { appMakerId },
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = nasabahs.map((n) => ({
      id: n.id,
      namaNasabah: n.namaNasabah,
      alamat: n.alamat,
      telp: n.telp,
      saldoPoin: n.saldoPoin,
      foto: n.foto,
      user: {
        username: n.user.username,
        role: n.user.role,
      },
    }));

    return {
      message: 'Daftar nasabah berhasil diambil',
      data,
    };
  }

  async create(appMakerId: string, dto: CreateNasabahDto, fotoUrl?: string) {
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
    const photo = fotoUrl || dto.foto || null;

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          appMakerId,
          username: dto.username,
          password: hashedPassword,
          role: Role.NASABAH,
        },
      });

      const nasabah = await tx.nasabah.create({
        data: {
          userId: user.id,
          appMakerId,
          namaNasabah: dto.namaNasabah,
          alamat: dto.alamat,
          telp: dto.telp,
          saldoPoin: 0,
          foto: photo,
        },
      });

      return {
        id: nasabah.id,
        namaNasabah: nasabah.namaNasabah,
        alamat: nasabah.alamat,
        telp: nasabah.telp,
        saldoPoin: nasabah.saldoPoin,
        foto: nasabah.foto,
        user: {
          username: user.username,
          role: user.role,
        },
      };
    });

    return {
      message: 'Nasabah baru berhasil ditambahkan',
      data: result,
    };
  }

  async findOne(appMakerId: string, id: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id, appMakerId },
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan.');
    }

    return {
      message: 'Detail nasabah berhasil diambil',
      data: {
        id: nasabah.id,
        namaNasabah: nasabah.namaNasabah,
        alamat: nasabah.alamat,
        telp: nasabah.telp,
        saldoPoin: nasabah.saldoPoin,
        foto: nasabah.foto,
        user: {
          username: nasabah.user.username,
          role: nasabah.user.role,
        },
        createdAt: nasabah.createdAt.toISOString(),
      },
    };
  }

  async update(
    appMakerId: string,
    id: string,
    dto: UpdateNasabahDto,
    fotoUrl?: string,
  ) {
    const existing = await this.prisma.nasabah.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Data nasabah tidak ditemukan.');
    }

    const nama = dto.namaLengkap || dto.namaNasabah || existing.namaNasabah;
    const telepon = dto.noTelepon || dto.telp || existing.telp;
    const alamat = dto.alamat || existing.alamat;
    const tanggalLahir = dto.tanggalLahir || existing.tanggalLahir;
    const photo = fotoUrl || dto.foto || existing.foto;

    const updated = await this.prisma.nasabah.update({
      where: { id },
      data: {
        namaNasabah: nama,
        telp: telepon,
        alamat,
        tanggalLahir,
        foto: photo,
      },
    });

    return {
      message: 'Data nasabah berhasil diperbarui',
      data: {
        id: updated.id,
        namaNasabah: updated.namaNasabah,
        alamat: updated.alamat,
        telp: updated.telp,
        saldoPoin: updated.saldoPoin,
      },
    };
  }

  async remove(appMakerId: string, id: string) {
    const existing = await this.prisma.nasabah.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Data nasabah tidak ditemukan.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.nasabah.delete({ where: { id } });
      await tx.user.delete({ where: { id: existing.userId } });
    });

    return {
      message: 'Data nasabah berhasil dihapus',
      data: {
        id,
      },
    };
  }
}
