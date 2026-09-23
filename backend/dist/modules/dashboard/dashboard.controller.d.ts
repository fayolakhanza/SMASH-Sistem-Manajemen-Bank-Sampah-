import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(appMakerId: string, user: any): Promise<{
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
    getStats(appMakerId: string): Promise<{
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
