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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNasabahSummary(appMakerId, nasabahId) {
        const nasabah = await this.prisma.nasabah.findFirst({
            where: { id: nasabahId, appMakerId },
        });
        if (!nasabah) {
            throw new common_1.NotFoundException('Data nasabah tidak ditemukan.');
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
        const totalSampahDisetorKg = setors.reduce((acc, curr) => acc + (curr.totalBeratKg || 0), 0);
        const totalPoinDidapat = setors.reduce((acc, curr) => {
            const poin = curr.totalPoin ?? curr.estimasiTotalPoin ?? 0;
            return acc + poin;
        }, 0);
        const totalPoinDitukar = penukarans.reduce((acc, curr) => acc + (curr.poinTerpakai || 0), 0);
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
    async getAdminStats(appMakerId) {
        const [totalNasabah, totalKategoriSampah, totalTransaksiSetor, totalHadiah, setors,] = await Promise.all([
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
        const totalBeratSampahKg = setors.reduce((acc, curr) => acc + (curr.totalBeratKg || 0), 0);
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map