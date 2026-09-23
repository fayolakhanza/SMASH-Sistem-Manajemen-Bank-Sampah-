import { RekapitulasiService } from './rekapitulasi.service';
export declare class RekapitulasiController {
    private readonly rekapitulasiService;
    constructor(rekapitulasiService: RekapitulasiService);
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
