import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getNasabahSummary(appMakerId: string, nasabahId: string): Promise<{
        message: string;
        data: {
            saldoPoinSaatIni: number;
            totalSampahDisetorKg: number;
            totalPoinDidapat: number;
            totalPoinDitukar: number;
            transaksiTerakhirSetor: {
                kodeSetor: string;
                tanggal: string;
                beratKg: number;
                poin: number;
                status: string;
            } | null;
            transaksiTerakhirTukar: {
                kodePenukaran: string;
                tanggal: string;
                hadiah: string;
                poin: number;
                status: string;
            } | null;
        };
    }>;
    getAdminStats(appMakerId: string): Promise<{
        message: string;
        data: {
            totalNasabah: number;
            totalKategoriSampah: number;
            totalTransaksiSetor: number;
            totalHadiah: number;
            totalBeratSampahKg: number;
            totalPoinTersalurkan: number;
        };
    }>;
}
