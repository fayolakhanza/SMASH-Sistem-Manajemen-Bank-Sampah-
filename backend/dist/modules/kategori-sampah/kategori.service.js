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
exports.KategoriSampahService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let KategoriSampahService = class KategoriSampahService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(appMakerId) {
        const data = await this.prisma.kategoriSampah.findMany({
            where: { appMakerId },
            select: {
                id: true,
                namaKategori: true,
                hargaPerKg: true,
                poinPerKg: true,
                jenis: true,
                foto: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            message: 'Daftar kategori sampah daur ulang berhasil diambil',
            data,
        };
    }
    async create(appMakerId, dto, fotoUrl) {
        const photo = fotoUrl || dto.foto || null;
        const kategori = await this.prisma.kategoriSampah.create({
            data: {
                appMakerId,
                namaKategori: dto.namaKategori,
                hargaPerKg: Number(dto.hargaPerKg),
                poinPerKg: Number(dto.poinPerKg),
                jenis: dto.jenis.toLowerCase(),
                foto: photo,
            },
        });
        return {
            message: 'Kategori sampah baru berhasil disimpan',
            data: {
                id: kategori.id,
                namaKategori: kategori.namaKategori,
                hargaPerKg: kategori.hargaPerKg,
                poinPerKg: kategori.poinPerKg,
                jenis: kategori.jenis,
                foto: kategori.foto,
            },
        };
    }
    async findOne(appMakerId, id) {
        const kategori = await this.prisma.kategoriSampah.findFirst({
            where: { id, appMakerId },
        });
        if (!kategori) {
            throw new common_1.NotFoundException('Kategori sampah tidak ditemukan.');
        }
        return {
            message: 'Detail kategori sampah berhasil diambil',
            data: {
                id: kategori.id,
                namaKategori: kategori.namaKategori,
                hargaPerKg: kategori.hargaPerKg,
                poinPerKg: kategori.poinPerKg,
                jenis: kategori.jenis,
                foto: kategori.foto,
            },
        };
    }
    async update(appMakerId, id, dto, fotoUrl) {
        const existing = await this.prisma.kategoriSampah.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Kategori sampah tidak ditemukan.');
        }
        const updated = await this.prisma.kategoriSampah.update({
            where: { id },
            data: {
                namaKategori: dto.namaKategori ?? existing.namaKategori,
                hargaPerKg: dto.hargaPerKg !== undefined
                    ? Number(dto.hargaPerKg)
                    : existing.hargaPerKg,
                poinPerKg: dto.poinPerKg !== undefined
                    ? Number(dto.poinPerKg)
                    : existing.poinPerKg,
                jenis: dto.jenis ? dto.jenis.toLowerCase() : existing.jenis,
                foto: fotoUrl || dto.foto || existing.foto,
            },
        });
        return {
            message: 'Kategori sampah berhasil diperbarui',
            data: {
                id: updated.id,
                namaKategori: updated.namaKategori,
                hargaPerKg: updated.hargaPerKg,
                poinPerKg: updated.poinPerKg,
                jenis: updated.jenis,
                foto: updated.foto,
            },
        };
    }
    async remove(appMakerId, id) {
        const existing = await this.prisma.kategoriSampah.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Kategori sampah tidak ditemukan.');
        }
        await this.prisma.kategoriSampah.delete({
            where: { id },
        });
        return {
            message: 'Kategori sampah berhasil dihapus',
            data: {
                id,
            },
        };
    }
};
exports.KategoriSampahService = KategoriSampahService;
exports.KategoriSampahService = KategoriSampahService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KategoriSampahService);
//# sourceMappingURL=kategori.service.js.map