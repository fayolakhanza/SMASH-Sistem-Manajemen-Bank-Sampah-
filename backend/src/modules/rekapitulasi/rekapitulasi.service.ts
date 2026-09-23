import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RekapitulasiService {
  constructor(private prisma: PrismaService) {}

  async getRekapitulasiBulanan(appMakerId: string, bulan?: string) {
    if (!bulan || !/^\d{4}-\d{2}$/.test(bulan)) {
      throw new BadRequestException(
        'Query parameter bulan wajib diisi dengan format YYYY-MM (contoh: 2026-08).',
      );
    }

    const [yearStr, monthStr] = bulan.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Get setoran valid (mengabaikan transaksi ditolak/dibatalkan)
    const setors = await this.prisma.setorSampah.findMany({
      where: {
        appMakerId,
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
        NOT: {
          status: {
            in: ['ditolak', 'dibatalkan', 'batal'],
          },
        },
      },
      include: {
        detailSetors: {
          include: {
            kategoriSampah: true,
          },
        },
      },
    });

    const breakdown: Record<
      string,
      { tonaseKg: number; rupiah: number; poin: number }
    > = {
      plastik: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kertas: { tonaseKg: 0, rupiah: 0, poin: 0 },
      logam: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kaca: { tonaseKg: 0, rupiah: 0, poin: 0 },
    };

    let totalKg = 0;
    let totalEstimasiPembayaranRupiah = 0;
    let totalPoinDiterbitkan = 0;

    for (const s of setors) {
      for (const d of s.detailSetors) {
        const jenis = (d.kategoriSampah?.jenis || 'lainnya').toLowerCase();
        const berat = d.beratKgReal ?? d.beratKg ?? 0;
        const hargaPerKg = d.kategoriSampah?.hargaPerKg ?? 0;
        const poin = d.subtotalPoin ?? 0;
        const rupiah = berat * hargaPerKg;

        if (!breakdown[jenis]) {
          breakdown[jenis] = { tonaseKg: 0, rupiah: 0, poin: 0 };
        }

        breakdown[jenis].tonaseKg += berat;
        breakdown[jenis].rupiah += rupiah;
        breakdown[jenis].poin += poin;

        totalKg += berat;
        totalEstimasiPembayaranRupiah += rupiah;
        totalPoinDiterbitkan += poin;
      }
    }

    // Get penukaran poin valid (mengabaikan transaksi ditolak/dibatalkan)
    const penukarans = await this.prisma.penukaranPoin.findMany({
      where: {
        appMakerId,
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
        NOT: {
          status: {
            in: ['ditolak', 'dibatalkan', 'batal'],
          },
        },
      },
    });

    const totalTransaksiPenukaran = penukarans.length;
    const totalPoinTerpakai = penukarans.reduce(
      (acc, curr) => acc + (curr.poinTerpakai || 0),
      0,
    );

    return {
      message: `Rekapitulasi Bank Sampah Bulan ${month}/${year} berhasil diambil`,
      data: {
        periode: bulan,
        rekapitulasiTonase: {
          totalKg: Number(totalKg.toFixed(2)),
          totalTon: Number((totalKg / 1000).toFixed(4)),
          totalEstimasiPembayaranRupiah: Math.round(totalEstimasiPembayaranRupiah),
          totalPoinDiterbitkan: Math.round(totalPoinDiterbitkan),
        },
        breakdownJenisSampah: breakdown,
        rekapitulasiPenukaranPoin: {
          totalTransaksiPenukaran,
          totalPoinTerpakai,
        },
      },
    };
  }
}