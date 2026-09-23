"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekapitulasiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RekapitulasiService = class RekapitulasiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRekapitulasiBulanan(appMakerId, bulan) {
        if (!bulan || !/^\d{4}-\d{2}$/.test(bulan)) {
            throw new common_1.BadRequestException('Query parameter bulan wajib diisi dengan format YYYY-MM (contoh: 2026-08).');
        }
        const [yearStr, monthStr] = bulan.split('-');
        const year = Number(yearStr);
        const month = Number(monthStr);
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
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
        const breakdown = {
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
        const totalPoinTerpakai = penukarans.reduce((acc, curr) => acc + (curr.poinTerpakai || 0), 0);
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
};
exports.RekapitulasiService = RekapitulasiService;
exports.RekapitulasiService = RekapitulasiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RekapitulasiService);
//# sourceMappingURL=rekapitulasi.service.js.map