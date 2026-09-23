import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKategoriSampahDto } from './dto/create-kategori.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori.dto';

@Injectable()
export class KategoriSampahService {
  constructor(private prisma: PrismaService) {}

  async findAll(appMakerId: string) {
    const data = await this.prisma.kategoriSampah.findMany({
      where: { appMakerId },
      select: {
        id: true,
        namaKategori: true,
        hargaPerKg: true,
        poinPerKg: true,
        jenis: true,
        foto: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      message: 'Daftar kategori sampah daur ulang berhasil diambil',
      data,
    };
  }

  async create(
    appMakerId: string,
    dto: CreateKategoriSampahDto,
    fotoUrl?: string,
  ) {
    const photo = fotoUrl || dto.foto || null;

    const kategori = await this.prisma.kategoriSampah.create({
      data: {
        appMakerId,
        namaKategori: dto.namaKategori,
        hargaPerKg: Number(dto.hargaPerKg),
        poinPerKg: Number(dto.poinPerKg),
        jenis: dto.jenis.toLowerCase(),
        foto: photo,
      },
    });

    return {
      message: 'Kategori sampah baru berhasil disimpan',
      data: {
        id: kategori.id,
        namaKategori: kategori.namaKategori,
        hargaPerKg: kategori.hargaPerKg,
        poinPerKg: kategori.poinPerKg,
        jenis: kategori.jenis,
        foto: kategori.foto,
      },
    };
  }

  async findOne(appMakerId: string, id: string) {
    const kategori = await this.prisma.kategoriSampah.findFirst({
      where: { id, appMakerId },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori sampah tidak ditemukan.');
    }

    return {
      message: 'Detail kategori sampah berhasil diambil',
      data: {
        id: kategori.id,
        namaKategori: kategori.namaKategori,
        hargaPerKg: kategori.hargaPerKg,
        poinPerKg: kategori.poinPerKg,
        jenis: kategori.jenis,
        foto: kategori.foto,
      },
    };
  }

  async update(
    appMakerId: string,
    id: string,
    dto: UpdateKategoriSampahDto,
    fotoUrl?: string,
  ) {
    const existing = await this.prisma.kategoriSampah.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Kategori sampah tidak ditemukan.');
    }

    const updated = await this.prisma.kategoriSampah.update({
      where: { id },
      data: {
        namaKategori: dto.namaKategori ?? existing.namaKategori,
        hargaPerKg:
          dto.hargaPerKg !== undefined
            ? Number(dto.hargaPerKg)
            : existing.hargaPerKg,
        poinPerKg:
          dto.poinPerKg !== undefined
            ? Number(dto.poinPerKg)
            : existing.poinPerKg,
        jenis: dto.jenis ? dto.jenis.toLowerCase() : existing.jenis,
        foto: fotoUrl || dto.foto || existing.foto,
      },
    });

    return {
      message: 'Kategori sampah berhasil diperbarui',
      data: {
        id: updated.id,
        namaKategori: updated.namaKategori,
        hargaPerKg: updated.hargaPerKg,
        poinPerKg: updated.poinPerKg,
        jenis: updated.jenis,
        foto: updated.foto,
      },
    };
  }

  async remove(appMakerId: string, id: string) {
    const existing = await this.prisma.kategoriSampah.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Kategori sampah tidak ditemukan.');
    }

    await this.prisma.kategoriSampah.delete({
      where: { id },
    });

    return {
      message: 'Kategori sampah berhasil dihapus',
      data: {
        id,
      },
    };
  }
}
