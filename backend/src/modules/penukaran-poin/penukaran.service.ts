import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePenukaranPoinDto,
  UpdateStatusPenukaranDto,
} from './dto/create-penukaran.dto';
import {
  generatePenukaranCode,
  generateVoucherCode,
} from '../../common/utils/code-generator.util';

@Injectable()
export class PenukaranPoinService {
  constructor(private prisma: PrismaService) {}

  async tukarPoin(
    appMakerId: string,
    nasabahId: string,
    dto: CreatePenukaranPoinDto,
  ) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id: nasabahId, appMakerId },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan.');
    }

    const hadiah = await this.prisma.hadiah.findFirst({
      where: { id: dto.hadiahId, appMakerId },
    });

    if (!hadiah) {
      throw new NotFoundException('Hadiah tidak ditemukan.');
    }

    if (hadiah.stok <= 0) {
      throw new BadRequestException('Stok hadiah sudah habis.');
    }

    if (nasabah.saldoPoin < hadiah.poinDibutuhkan) {
      throw new BadRequestException(
        `Saldo poin Anda (${nasabah.saldoPoin} poin) tidak mencukupi untuk menukar hadiah ini (${hadiah.poinDibutuhkan} poin).`,
      );
    }

    const count = await this.prisma.penukaranPoin.count({
      where: { appMakerId },
    });
    const kodePenukaran = generatePenukaranCode(5001 + count);

    // Handling Safe Optional Chaining untuk Kategori
    const isDigital =
      hadiah.kategori?.toLowerCase() === 'digital' ||
      hadiah.namaHadiah.toLowerCase().includes('voucher') ||
      hadiah.namaHadiah.toLowerCase().includes('pulsa');

    const kodeVoucher = isDigital ? generateVoucherCode() : null;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Kurangi saldo nasabah
      const updatedNasabah = await tx.nasabah.update({
        where: { id: nasabah.id },
        data: {
          saldoPoin: {
            decrement: hadiah.poinDibutuhkan,
          },
        },
      });

      // 2. Kurangi stok hadiah
      await tx.hadiah.update({
        where: { id: hadiah.id },
        data: {
          stok: {
            decrement: 1,
          },
        },
      });

      // 3. Buat record transaksi penukaran
      const penukaran = await tx.penukaranPoin.create({
        data: {
          appMakerId,
          nasabahId: nasabah.id,
          hadiahId: hadiah.id,
          kodePenukaran,
          kodeVoucher,
          tanggal: new Date(),
          poinTerpakai: hadiah.poinDibutuhkan,
          sisaSaldoPoin: updatedNasabah.saldoPoin,
          status: 'diproses',
        },
      });

      return {
        id: penukaran.id,
        kodePenukaran: penukaran.kodePenukaran,
        tanggal: penukaran.tanggal.toISOString(),
        hadiahId: penukaran.hadiahId,
        poinTerpakai: penukaran.poinTerpakai,
        sisaSaldoPoin: penukaran.sisaSaldoPoin,
        status: penukaran.status,
        kodeVoucher: penukaran.kodeVoucher,
        hadiah: {
          namaHadiah: hadiah.namaHadiah,
        },
      };
    });

    return {
      message: 'Penukaran poin berhasil diajukan',
      data: result,
    };
  }

  async getMyPenukaran(appMakerId: string, nasabahId: string) {
    const list = await this.prisma.penukaranPoin.findMany({
      where: { appMakerId, nasabahId },
      include: {
        hadiah: {
          select: {
            namaHadiah: true,
            poinDibutuhkan: true,
            foto: true,
          },
        },
      },
      orderBy: { tanggal: 'desc' },
    });

    const data = list.map((item) => ({
      id: item.id,
      kodePenukaran: item.kodePenukaran,
      tanggal: item.tanggal.toISOString(),
      poinTerpakai: item.poinTerpakai,
      status: item.status,
      kodeVoucher: item.kodeVoucher || undefined,
      hadiah: {
        namaHadiah: item.hadiah.namaHadiah,
        poinDibutuhkan: item.hadiah.poinDibutuhkan,
        foto: item.hadiah.foto,
      },
    }));

    return {
      message: 'Histori penukaran poin nasabah berhasil diambil',
      data,
    };
  }

  async getAdminList(appMakerId: string, bulan?: string) {
    let whereFilter: any = { appMakerId };
    if (bulan) {
      const [year, month] = bulan.split('-').map(Number);
      if (year && month) {
        const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        whereFilter.tanggal = {
          gte: start,
          lte: end,
        };
      }
    }

    const list = await this.prisma.penukaranPoin.findMany({
      where: whereFilter,
      include: {
        nasabah: {
          select: {
            namaNasabah: true,
            telp: true,
          },
        },
        hadiah: {
          select: {
            namaHadiah: true,
          },
        },
      },
      orderBy: { tanggal: 'desc' },
    });

    const data = list.map((item) => ({
      id: item.id,
      kodePenukaran: item.kodePenukaran,
      tanggal: item.tanggal.toISOString(),
      nasabah: {
        namaNasabah: item.nasabah.namaNasabah,
        telp: item.nasabah.telp,
      },
      hadiah: {
        namaHadiah: item.hadiah.namaHadiah,
      },
      poinTerpakai: item.poinTerpakai,
      status: item.status,
      kodeVoucher: item.kodeVoucher || undefined,
    }));

    return {
      message: 'Seluruh data transaksi penukaran poin berhasil diambil',
      data,
    };
  }

  async updateStatus(
    appMakerId: string,
    id: string,
    dto: UpdateStatusPenukaranDto,
  ) {
    const existing = await this.prisma.penukaranPoin.findFirst({
      where: { id, appMakerId },
    });

    if (!existing) {
      throw new NotFoundException('Transaksi penukaran poin tidak ditemukan.');
    }

    const newStatus = dto.status.toLowerCase();

    // Menggunakan Prisma Transaction untuk Refund jika transaksi ditolak/dibatalkan
    const updated = await this.prisma.$transaction(async (tx) => {
      const isRejectOrCancel =
        newStatus === 'ditolak' ||
        newStatus === 'dibatalkan' ||
        newStatus === 'batal';

      const isCurrentlyPending =
        existing.status.toLowerCase() === 'diproses' ||
        existing.status.toLowerCase() === 'menunggu';

      // Refund saldo dan stok HANYA JIKA sebelumnya berstatus pending/diproses
      if (isRejectOrCancel && isCurrentlyPending) {
        // 1. Kembalikan saldo poin ke Nasabah
        await tx.nasabah.update({
          where: { id: existing.nasabahId },
          data: {
            saldoPoin: {
              increment: existing.poinTerpakai,
            },
          },
        });

        // 2. Kembalikan stok Hadiah
        await tx.hadiah.update({
          where: { id: existing.hadiahId },
          data: {
            stok: {
              increment: 1,
            },
          },
        });
      }

      return await tx.penukaranPoin.update({
        where: { id },
        data: {
          status: newStatus,
        },
      });
    });

    return {
      message: 'Status transaksi penukaran poin berhasil diperbarui',
      data: {
        id: updated.id,
        status: updated.status,
      },
    };
  }

  async getNota(appMakerId: string, id: string, user: any) {
    const penukaran = await this.prisma.penukaranPoin.findFirst({
      where: { id, appMakerId },
      include: {
        nasabah: {
          select: {
            id: true,
            namaNasabah: true,
            telp: true,
          },
        },
        hadiah: {
          select: {
            namaHadiah: true,
            poinDibutuhkan: true,
          },
        },
      },
    });

    if (!penukaran) {
      throw new NotFoundException('Struk nota penukaran poin tidak ditemukan.');
    }

    if (user.role === 'NASABAH' && penukaran.nasabahId !== user.nasabah?.id) {
      throw new ForbiddenException('Akses ditolak ke nota orang lain.');
    }

    return {
      message: 'Struk nota penukaran poin berhasil diambil',
      data: {
        id: penukaran.id,
        kodePenukaran: penukaran.kodePenukaran,
        tanggal: penukaran.tanggal.toISOString(),
        nasabah: {
          namaNasabah: penukaran.nasabah.namaNasabah,
          telp: penukaran.nasabah.telp,
        },
        hadiah: {
          namaHadiah: penukaran.hadiah.namaHadiah,
          poinDibutuhkan: penukaran.hadiah.poinDibutuhkan,
        },
        poinTerpakai: penukaran.poinTerpakai,
        status: penukaran.status,
        kodeVoucher: penukaran.kodeVoucher || undefined,
      },
    };
  }
}