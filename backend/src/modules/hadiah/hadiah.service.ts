import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';

@Injectable()
export class HadiahService {
  constructor(private prisma: PrismaService) {}

  async findAll(appMakerId: string) {
    const data = await this.prisma.hadiah.findMany({
      where: { appMakerId },
      select: {
        id: true,
        namaHadiah: true,
        poinDibutuhkan: true,
        stok: true,
        foto: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      message: 'Daftar barang/voucher hadiah berhasil diambil',
      data,
    };
  }

  async create(appMakerId: string, dto: CreateHadiahDto, fotoUrl?: string) {
    const photo = fotoUrl || dto.foto || null;

    const hadiah = await this.prisma.hadiah.create({
      data: {
        appMakerId,
        namaHadiah: dto.namaHadiah,
        poinDibutuhkan: Number(dto.poinDibutuhkan),
        stok: Number(dto.stok),
        kategori: dto.kategori || 'fisik',
        foto: photo,
      },
    });

    return {
      message: 'Hadiah baru berhasil ditambahkan',
      data: {
        id: hadiah.id,
        namaHadiah: hadiah.namaHadiah,
        poinDibutuhkan: hadiah.poinDibutuhkan,
        stok: hadiah.stok,
        foto: hadiah.foto,
      },
    };
  }

  async findOne(appMakerId: string, id: string) {
    const hadiah = await this.prisma.hadiah.findFirst({
      where: { id, appMakerId },
    });

    if (!hadiah) {
      throw new NotFoundException('Hadiah tidak ditemukan.');
    }

    return {
      message: 'Detail hadiah berhasil diambil',
      data: {
        id: hadiah.id,
        namaHadiah: hadiah.namaHadiah,
        poinDibutuhkan: hadiah.poinDibutuhkan,
        stok: hadiah.stok,
        foto: hadiah.foto,
      },
    };
  }

  async update(
    appMakerId: string,
    id: string,
    dto: UpdateHadiahDto,
    fotoUrl?: string,
  ) {
    const existing = await this.prisma.hadiah.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Hadiah tidak ditemukan.');
    }

    const updated = await this.prisma.hadiah.update({
      where: { id },
      data: {
        namaHadiah: dto.namaHadiah ?? existing.namaHadiah,
        poinDibutuhkan:
          dto.poinDibutuhkan !== undefined
            ? Number(dto.poinDibutuhkan)
            : existing.poinDibutuhkan,
        stok: dto.stok !== undefined ? Number(dto.stok) : existing.stok,
        kategori: dto.kategori ?? existing.kategori,
        foto: fotoUrl || dto.foto || existing.foto,
      },
    });

    return {
      message: 'Data hadiah berhasil diperbarui',
      data: {
        id: updated.id,
        namaHadiah: updated.namaHadiah,
        poinDibutuhkan: updated.poinDibutuhkan,
        stok: updated.stok,
      },
    };
  }

  async remove(appMakerId: string, id: string) {
    const existing = await this.prisma.hadiah.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Hadiah tidak ditemukan.');
    }

    await this.prisma.hadiah.delete({
      where: { id },
    });

    return {
      message: 'Hadiah berhasil dihapus',
      data: {
        id,
      },
    };
  }
}
