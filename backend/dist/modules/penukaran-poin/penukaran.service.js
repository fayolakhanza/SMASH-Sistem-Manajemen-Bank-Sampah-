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
exports.PenukaranPoinService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const code_generator_util_1 = require("../../common/utils/code-generator.util");
let PenukaranPoinService = class PenukaranPoinService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async tukarPoin(appMakerId, nasabahId, dto) {
        const nasabah = await this.prisma.nasabah.findFirst({
            where: { id: nasabahId, appMakerId },
        });
        if (!nasabah) {
            throw new common_1.NotFoundException('Data nasabah tidak ditemukan.');
        }
        const hadiah = await this.prisma.hadiah.findFirst({
            where: { id: dto.hadiahId, appMakerId },
        });
        if (!hadiah) {
            throw new common_1.NotFoundException('Hadiah tidak ditemukan.');
        }
        if (hadiah.stok <= 0) {
            throw new common_1.BadRequestException('Stok hadiah sudah habis.');
        }
        if (nasabah.saldoPoin < hadiah.poinDibutuhkan) {
            throw new common_1.BadRequestException(`Saldo poin Anda (${nasabah.saldoPoin} poin) tidak mencukupi untuk menukar hadiah ini (${hadiah.poinDibutuhkan} poin).`);
        }
        const count = await this.prisma.penukaranPoin.count({
            where: { appMakerId },
        });
        const kodePenukaran = (0, code_generator_util_1.generatePenukaranCode)(5001 + count);
        const isDigital = hadiah.kategori?.toLowerCase() === 'digital' ||
            hadiah.namaHadiah.toLowerCase().includes('voucher') ||
            hadiah.namaHadiah.toLowerCase().includes('pulsa');
        const kodeVoucher = isDigital ? (0, code_generator_util_1.generateVoucherCode)() : null;
        const result = await this.prisma.$transaction(async (tx) => {
            const updatedNasabah = await tx.nasabah.update({
                where: { id: nasabah.id },
                data: {
                    saldoPoin: {
                        decrement: hadiah.poinDibutuhkan,
                    },
                },
            });
            await tx.hadiah.update({
                where: { id: hadiah.id },
                data: {
                    stok: {
                        decrement: 1,
                    },
                },
            });
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
    async getMyPenukaran(appMakerId, nasabahId) {
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
    async getAdminList(appMakerId, bulan) {
        let whereFilter = { appMakerId };
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
    async updateStatus(appMakerId, id, dto) {
        const existing = await this.prisma.penukaranPoin.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Transaksi penukaran poin tidak ditemukan.');
        }
        const newStatus = dto.status.toLowerCase();
        const updated = await this.prisma.$transaction(async (tx) => {
            const isRejectOrCancel = newStatus === 'ditolak' ||
                newStatus === 'dibatalkan' ||
                newStatus === 'batal';
            const isCurrentlyPending = existing.status.toLowerCase() === 'diproses' ||
                existing.status.toLowerCase() === 'menunggu';
            if (isRejectOrCancel && isCurrentlyPending) {
                await tx.nasabah.update({
                    where: { id: existing.nasabahId },
                    data: {
                        saldoPoin: {
                            increment: existing.poinTerpakai,
                        },
                    },
                });
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
    async getNota(appMakerId, id, user) {
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
            throw new common_1.NotFoundException('Struk nota penukaran poin tidak ditemukan.');
        }
        if (user.role === 'NASABAH' && penukaran.nasabahId !== user.nasabah?.id) {
            throw new common_1.ForbiddenException('Akses ditolak ke nota orang lain.');
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
};
exports.PenukaranPoinService = PenukaranPoinService;
exports.PenukaranPoinService = PenukaranPoinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PenukaranPoinService);
//# sourceMappingURL=penukaran.service.js.map