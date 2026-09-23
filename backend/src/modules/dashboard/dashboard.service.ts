import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getNasabahSummary(appMakerId: string, nasabahId: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id: nasabahId, appMakerId },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan.');
    }

    const setors = await this.prisma.setorSampah.findMany({
      where: { appMakerId, nasabahId },
      orderBy: { tanggal: 'desc' },
    });

    const penukarans = await this.prisma.penukaranPoin.findMany({
      where: { appMakerId, nasabahId },
      include: {
        hadiah: true,
      },
      orderBy: { tanggal: 'desc' },
    });

    const totalSampahDisetorKg = setors.reduce(
      (acc, curr) => acc + (curr.totalBeratKg || 0),
      0,
    );

    const totalPoinDidapat = setors.reduce((acc, curr) => {
      const poin = curr.totalPoin ?? curr.estimasiTotalPoin ?? 0;
      return acc + poin;
    }, 0);

    const totalPoinDitukar = penukarans.reduce(
      (acc, curr) => acc + (curr.poinTerpakai || 0),
      0,
    );

    const lastSetor = setors[0];
    const lastTukar = penukarans[0];

    return {
      message: 'Summary dashboard nasabah berhasil diambil',
      data: {
        saldoPoinSaatIni: nasabah.saldoPoin,
        totalSampahDisetorKg: Number(totalSampahDisetorKg.toFixed(2)),
        totalPoinDidapat,
        totalPoinDitukar,
        transaksiTerakhirSetor: lastSetor
          ? {
              kodeSetor: lastSetor.kodeSetor,
              tanggal: lastSetor.tanggal.toISOString(),
              beratKg: lastSetor.totalBeratKg,
              poin: lastSetor.totalPoin ?? lastSetor.estimasiTotalPoin,
              status: lastSetor.status,
            }
          : null,
        transaksiTerakhirTukar: lastTukar
          ? {
              kodePenukaran: lastTukar.kodePenukaran,
              tanggal: lastTukar.tanggal.toISOString(),
              hadiah: lastTukar.hadiah?.namaHadiah || '',
              poin: lastTukar.poinTerpakai,
              status: lastTukar.status,
            }
          : null,
      },
    };
  }

  async getAdminStats(appMakerId: string) {
    const [
      totalNasabah,
      totalKategoriSampah,
      totalTransaksiSetor,
      totalHadiah,
      setors,
    ] = await Promise.all([
      this.prisma.nasabah.count({ where: { appMakerId } }),
      this.prisma.kategoriSampah.count({ where: { appMakerId } }),
      this.prisma.setorSampah.count({ where: { appMakerId } }),
      this.prisma.hadiah.count({ where: { appMakerId } }),
      this.prisma.setorSampah.findMany({
        where: { appMakerId },
        select: {
          totalBeratKg: true,
          totalPoin: true,
          estimasiTotalPoin: true,
        },
      }),
    ]);

    const totalBeratSampahKg = setors.reduce(
      (acc, curr) => acc + (curr.totalBeratKg || 0),
      0,
    );

    const totalPoinTersalurkan = setors.reduce((acc, curr) => {
      const poin = curr.totalPoin ?? curr.estimasiTotalPoin ?? 0;
      return acc + poin;
    }, 0);

    return {
      message: 'Statistik dashboard Bank Sampah milik App Maker',
      data: {
        totalNasabah,
        totalKategoriSampah,
        totalTransaksiSetor,
        totalHadiah,
        totalBeratSampahKg: Number(totalBeratSampahKg.toFixed(2)),
        totalPoinTersalurkan,
      },
    };
  }
}
