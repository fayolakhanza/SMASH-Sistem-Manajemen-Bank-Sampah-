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
exports.HadiahService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let HadiahService = class HadiahService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(appMakerId) {
        const data = await this.prisma.hadiah.findMany({
            where: { appMakerId },
            select: {
                id: true,
                namaHadiah: true,
                poinDibutuhkan: true,
                stok: true,
                foto: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            message: 'Daftar barang/voucher hadiah berhasil diambil',
            data,
        };
    }
    async create(appMakerId, dto, fotoUrl) {
        const photo = fotoUrl || dto.foto || null;
        const hadiah = await this.prisma.hadiah.create({
            data: {
                appMakerId,
                namaHadiah: dto.namaHadiah,
                poinDibutuhkan: Number(dto.poinDibutuhkan),
                stok: Number(dto.stok),
                kategori: dto.kategori || 'fisik',
                foto: photo,
            },
        });
        return {
            message: 'Hadiah baru berhasil ditambahkan',
            data: {
                id: hadiah.id,
                namaHadiah: hadiah.namaHadiah,
                poinDibutuhkan: hadiah.poinDibutuhkan,
                stok: hadiah.stok,
                foto: hadiah.foto,
            },
        };
    }
    async findOne(appMakerId, id) {
        const hadiah = await this.prisma.hadiah.findFirst({
            where: { id, appMakerId },
        });
        if (!hadiah) {
            throw new common_1.NotFoundException('Hadiah tidak ditemukan.');
        }
        return {
            message: 'Detail hadiah berhasil diambil',
            data: {
                id: hadiah.id,
                namaHadiah: hadiah.namaHadiah,
                poinDibutuhkan: hadiah.poinDibutuhkan,
                stok: hadiah.stok,
                foto: hadiah.foto,
            },
        };
    }
    async update(appMakerId, id, dto, fotoUrl) {
        const existing = await this.prisma.hadiah.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Hadiah tidak ditemukan.');
        }
        const updated = await this.prisma.hadiah.update({
            where: { id },
            data: {
                namaHadiah: dto.namaHadiah ?? existing.namaHadiah,
                poinDibutuhkan: dto.poinDibutuhkan !== undefined
                    ? Number(dto.poinDibutuhkan)
                    : existing.poinDibutuhkan,
                stok: dto.stok !== undefined ? Number(dto.stok) : existing.stok,
                kategori: dto.kategori ?? existing.kategori,
                foto: fotoUrl || dto.foto || existing.foto,
            },
        });
        return {
            message: 'Data hadiah berhasil diperbarui',
            data: {
                id: updated.id,
                namaHadiah: updated.namaHadiah,
                poinDibutuhkan: updated.poinDibutuhkan,
                stok: updated.stok,
            },
        };
    }
    async remove(appMakerId, id) {
        const existing = await this.prisma.hadiah.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Hadiah tidak ditemukan.');
        }
        await this.prisma.hadiah.delete({
            where: { id },
        });
        return {
            message: 'Hadiah berhasil dihapus',
            data: {
                id,
            },
        };
    }
};
exports.HadiahService = HadiahService;
exports.HadiahService = HadiahService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HadiahService);
//# sourceMappingURL=hadiah.service.js.map