import { PrismaService } from '../../prisma/prisma.service';
export declare class RekapitulasiService {
    private prisma;
    constructor(prisma: PrismaService);
    getRekapitulasiBulanan(appMakerId: string, bulan?: string): Promise<{
        message: string;
        data: {
            periode: string;
            rekapitulasiTonase: {
                totalKg: number;
                totalTon: number;
                totalEstimasiPembayaranRupiah: number;
                totalPoinDiterbitkan: number;
            };
            breakdownJenisSampah: Record<string, {
                tonaseKg: number;
                rupiah: number;
                poin: number;
            }>;
            rekapitulasiPenukaranPoin: {
                totalTransaksiPenukaran: number;
                totalPoinTerpakai: number;
            };
        };
    }>;
}
