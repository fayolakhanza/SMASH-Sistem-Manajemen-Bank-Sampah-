import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSetorSampahDto, ItemSetorDto } from './dto/create-setor.dto';
import { VerifySetorSampahDto } from './dto/verify-setor.dto';
import { generateSetorCode } from '../../common/utils/code-generator.util';

@Injectable()
export class SetorSampahService {
  constructor(private prisma: PrismaService) {}

  async createPengajuan(
    appMakerId: string,
    nasabahId: string,
    dto: CreateSetorSampahDto,
    fotoBuktiUrl?: string,
  ) {
    let items: ItemSetorDto[] = [];
    if (typeof dto.items === 'string') {
      try {
        items = JSON.parse(dto.items);
      } catch (err) {
        throw new BadRequestException('Format items tidak valid JSON array.');
      }
    } else if (Array.isArray(dto.items)) {
      items = dto.items;
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Minimal harus memilih 1 item sampah.');
    }

    // Validate category IDs and calculate points
    let totalBeratKg = 0;
    let estimasiTotalPoin = 0;
    const detailItemsToCreate: any[] = [];

    for (const item of items) {
      const kategori = await this.prisma.kategoriSampah.findFirst({
        where: { id: item.kategoriSampahId, appMakerId },
      });

      if (!kategori) {
        throw new BadRequestException(
          `Kategori sampah dengan ID ${item.kategoriSampahId} tidak ditemukan.`,
        );
      }

      let rawWeight = 1;
      const b1 = Number(item.berat);
      const b2 = Number(item.beratKg);
      if (!isNaN(b1) && b1 > 0) {
        rawWeight = b1;
      } else if (!isNaN(b2) && b2 > 0) {
        rawWeight = b2;
      }

      const satuan = (item.satuan || 'kg').toLowerCase().trim();
      const berat = satuan === 'ton' ? rawWeight * 1000 : rawWeight;
      const subtotal = Math.round(berat * kategori.poinPerKg);
      totalBeratKg += berat;
      estimasiTotalPoin += subtotal;

      detailItemsToCreate.push({
        kategoriSampahId: kategori.id,
        beratKg: berat,
        subtotalPoin: subtotal,
        poinPerKg: kategori.poinPerKg,
      });
    }

    const count = await this.prisma.setorSampah.count({
      where: { appMakerId },
    });
    const kodeSetor = generateSetorCode(1001 + count);

    const photo = fotoBuktiUrl || dto.fotoBukti || null;
    const tanggalDate = new Date(dto.tanggal);

    const result = await this.prisma.$transaction(async (tx) => { //utk menyimpan detailsetor dari awal sampai akhir
      const setor = await tx.setorSampah.create({
        data: {
          appMakerId,
          nasabahId,
          kodeSetor,
          tanggal: isNaN(tanggalDate.getTime()) ? new Date() : tanggalDate,
          status: 'menunggu_konfirmasi',
          catatan: dto.catatan,
          fotoBukti: photo,
          totalBeratKg: Number(totalBeratKg.toFixed(2)),
          estimasiTotalPoin,
          totalPoin: estimasiTotalPoin,
          detailSetors: {
            create: detailItemsToCreate,
          },
        },
        include: {
          detailSetors: true,
        },
      });

      return {
        id: setor.id,
        kodeSetor: setor.kodeSetor,
        tanggal: setor.tanggal.toISOString(),
        status: setor.status,
        totalBeratKg: setor.totalBeratKg,
        estimasiTotalPoin: setor.estimasiTotalPoin,
        totalPoin: setor.totalPoin,
        catatan: setor.catatan,
        detailSetors: setor.detailSetors.map((d) => ({
          kategoriSampahId: d.kategoriSampahId,
          beratKg: d.beratKg,
          subtotalPoin: d.subtotalPoin,
          poinPerKg: d.poinPerKg,
        })),
      };
    });

    return {
      message: 'Pengajuan penyetoran sampah berhasil dibuat',
      data: result,
    };
  }

  async getMySetor(appMakerId: string, nasabahId: string, bulan?: string) {
    let dateFilter: any = {}; //filter waktu
    if (bulan) {
      const [year, month] = bulan.split('-').map(Number);
      if (year && month) {
        const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        dateFilter = {
          tanggal: {
            gte: start,
            lte: end,
          },
        };
      }
    }

    const setors = await this.prisma.setorSampah.findMany({
      where: {
        appMakerId,
        nasabahId,
        ...dateFilter,
      },
      include: {
        detailSetors: {
          include: {
            kategoriSampah: {
              select: {
                id: true,
                namaKategori: true,
                poinPerKg: true,
                hargaPerKg: true,
                jenis: true,
              },
            },
          },
        },
      },
      orderBy: { tanggal: 'desc' },
    });

    const data = setors.map((s) => ({
      id: s.id,
      kodeSetor: s.kodeSetor,
      tanggal: s.tanggal.toISOString(),
      status: s.status,
      totalBeratKg: s.totalBeratKg,
      totalPoin: s.totalPoin ?? s.estimasiTotalPoin,
      estimasiTotalPoin: s.estimasiTotalPoin,
      catatan: s.catatan,
      catatanAdmin: s.catatanAdmin,
      fotoBukti: s.fotoBukti,
      detailSetors: s.detailSetors.map((d) => ({
        id: d.id,
        kategoriSampahId: d.kategoriSampahId,
        beratKg: d.beratKgReal ?? d.beratKg,
        berat: d.beratKgReal ?? d.beratKg,
        subtotalPoin: d.subtotalPoin,
        poinPerKg: d.poinPerKg,
        kategoriSampah: {
          id: d.kategoriSampah?.id,
          namaKategori: d.kategoriSampah?.namaKategori || '',
          jenis: d.kategoriSampah?.jenis || '',
          poinPerKg: d.kategoriSampah?.poinPerKg || 0,
        },
      })),
    }));

    return {
      message: 'Histori pengajuan penyetoran sampah berhasil diambil',
      data,
    };
  }

  async getAdminList(appMakerId: string, status?: string, bulan?: string) {
    let whereFilter: any = { appMakerId };
    if (status) {
      const s = status.toLowerCase();
      if (s.includes('menunggu') || s.includes('pending')) {
        whereFilter.status = { in: ['menunggu_konfirmasi', 'menunggu', 'MENUNGGU'] };
      } else if (s.includes('verifikasi') || s.includes('selesai')) {
        whereFilter.status = { in: ['diverifikasi', 'selesai', 'DIVERIFIKASI', 'SELESAI'] };
      } else if (s.includes('tolak')) {
        whereFilter.status = { in: ['ditolak', 'DITOLAK'] };
      } else {
        whereFilter.status = status;
      }
    }
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

    const setors = await this.prisma.setorSampah.findMany({
      where: whereFilter,
      include: {
        nasabah: {
          select: {
            namaNasabah: true,
            telp: true,
          },
        },
        detailSetors: {
          include: {
            kategoriSampah: {
              select: {
                id: true,
                namaKategori: true,
                poinPerKg: true,
                hargaPerKg: true,
                jenis: true,
              },
            },
          },
        },
      },
      orderBy: { tanggal: 'desc' },
    });

    const data = setors.map((s) => ({
      id: s.id,
      kodeSetor: s.kodeSetor,
      tanggal: s.tanggal.toISOString(),
      nasabah: {
        namaNasabah: s.nasabah?.namaNasabah || 'Nasabah',
        telp: s.nasabah?.telp || '',
      },
      status: s.status,
      totalBeratKg: s.totalBeratKg,
      totalPoin: s.totalPoin ?? s.estimasiTotalPoin,
      estimasiTotalPoin: s.estimasiTotalPoin,
      catatan: s.catatan,
      fotoBukti: s.fotoBukti,
      catatanAdmin: s.catatanAdmin,
      detailSetors: s.detailSetors.map((d) => ({
        id: d.id,
        kategoriSampahId: d.kategoriSampahId,
        beratKg: d.beratKgReal ?? d.beratKg,
        berat: d.beratKgReal ?? d.beratKg,
        poinPerKg: d.poinPerKg,
        subtotalPoin: d.subtotalPoin,
        namaKategori: d.kategoriSampah?.namaKategori,
        kategoriSampah: d.kategoriSampah,
      })),
      items: s.detailSetors.map((d) => ({
        kategoriSampahId: d.kategoriSampahId,
        namaKategori: d.kategoriSampah?.namaKategori,
        berat: d.beratKgReal ?? d.beratKg,
        beratKg: d.beratKgReal ?? d.beratKg,
        poinPerKg: d.poinPerKg,
      })),
    }));

    return {
      message: 'Seluruh data pengajuan penyetoran sampah berhasil diambil',
      data,
    };
  }

  async getDetail(appMakerId: string, id: string, user: any) {
    const setor = await this.prisma.setorSampah.findFirst({
      where: { id, appMakerId },
      include: {
        nasabah: {
          select: {
            id: true,
            namaNasabah: true,
            alamat: true,
            telp: true,
          },
        },
        detailSetors: {
          include: {
            kategoriSampah: true,
          },
        },
      },
    });

    if (!setor) {
      throw new NotFoundException('Data transaksi penyetoran tidak ditemukan.');
    }

    if (user.role === 'NASABAH' && setor.nasabahId !== user.nasabah?.id) {
      throw new ForbiddenException('Akses ditolak ke nota orang lain.');
    }

    return {
      message: 'Detail transaksi penyetoran sampah berhasil diambil',
      data: {
        id: setor.id,
        kodeSetor: setor.kodeSetor,
        tanggal: setor.tanggal.toISOString(),
        status: setor.status,
        nasabah: {
          namaNasabah: setor.nasabah.namaNasabah,
          alamat: setor.nasabah.alamat,
          telp: setor.nasabah.telp,
        },
        totalBeratKg: setor.totalBeratKg,
        totalPoin: setor.totalPoin ?? setor.estimasiTotalPoin,
        estimasiTotalPoin: setor.estimasiTotalPoin,
        catatanAdmin: setor.catatanAdmin || null,
        detailSetors: setor.detailSetors.map((d) => ({
          kategoriSampahId: d.kategoriSampahId,
          kategori: d.kategoriSampah?.namaKategori || '',
          namaKategori: d.kategoriSampah?.namaKategori || '',
          jenis: d.kategoriSampah?.jenis || '',
          beratKg: d.beratKgReal ?? d.beratKg,
          berat: d.beratKgReal ?? d.beratKg,
          poinPerKg: d.poinPerKg ?? d.kategoriSampah?.poinPerKg ?? 0,
          subtotalPoin: d.subtotalPoin,
        })),
        items: setor.detailSetors.map((d) => ({
          kategoriSampahId: d.kategoriSampahId,
          namaKategori: d.kategoriSampah?.namaKategori || '',
          berat: d.beratKgReal ?? d.beratKg,
          beratKg: d.beratKgReal ?? d.beratKg,
          poinPerKg: d.poinPerKg ?? d.kategoriSampah?.poinPerKg ?? 0,
        })),
      },
    };
  }

  async verify(appMakerId: string, id: string, dto: VerifySetorSampahDto) {
    const setor = await this.prisma.setorSampah.findFirst({
      where: { id, appMakerId },
      include: {
        detailSetors: true,
      },
    });

    if (!setor) {
      throw new NotFoundException('Data penyetoran sampah tidak ditemukan.');
    }

    const previousStatus = setor.status;
    const newStatus = dto.status.toLowerCase();
    const finalCatatan =
      dto.catatanAdmin ||
      (newStatus === 'ditolak'
        ? 'Penyetoran ditolak oleh petugas bank sampah.'
        : 'Berat sampah diverifikasi dan poin berhasil disalurkan.');

    const result = await this.prisma.$transaction(async (tx) => {
      let finalTotalPoin = setor.totalPoin ?? setor.estimasiTotalPoin;
      let finalTotalBerat = setor.totalBeratKg;

      if (dto.itemsReal && dto.itemsReal.length > 0) {
        let calcPoin = 0;
        let calcBerat = 0;

        for (const itemReal of dto.itemsReal) {
          const detail = setor.detailSetors.find(
            (d) => d.kategoriSampahId === itemReal.kategoriSampahId,
          );

          const kategori = await tx.kategoriSampah.findUnique({
            where: { id: itemReal.kategoriSampahId },
          });

          const rate = kategori?.poinPerKg ?? detail?.poinPerKg ?? 10;
          const subtotal = Math.round(itemReal.beratKgReal * rate);

          calcPoin += subtotal;
          calcBerat += itemReal.beratKgReal;

          if (detail) {
            await tx.detailSetor.update({
              where: { id: detail.id },
              data: {
                beratKgReal: itemReal.beratKgReal,
                subtotalPoin: subtotal,
                poinPerKg: rate,
              },
            });
          }
        }

        finalTotalPoin = calcPoin;
        finalTotalBerat = Number(calcBerat.toFixed(2));
      }

      const updatedSetor = await tx.setorSampah.update({
        where: { id },
        data: {
          status: newStatus,
          catatanAdmin: finalCatatan,
          totalPoin: finalTotalPoin,
          totalBeratKg: finalTotalBerat,
        },
      });

      // If newly verified/completed, credit nasabah saldo
      if (
        (newStatus === 'selesai' || newStatus === 'diverifikasi') &&
        previousStatus !== 'selesai' &&
        previousStatus !== 'diverifikasi'
      ) {
        await tx.nasabah.update({
          where: { id: setor.nasabahId },
          data: {
            saldoPoin: {
              increment: finalTotalPoin,
            },
          },
        });
      }

      return updatedSetor;
    });

    return {
      message:
        'Verifikasi penyetoran sampah berhasil disimpan dan poin nasabah telah diperbarui',
      data: {
        id: result.id,
        status: result.status,
        totalPoin: result.totalPoin,
        catatanAdmin: result.catatanAdmin,
      },
    };
  }
}
