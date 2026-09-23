"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NasabahService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let NasabahService = class NasabahService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(appMakerId) {
        const nasabahs = await this.prisma.nasabah.findMany({
            where: { appMakerId },
            include: {
                user: {
                    select: {
                        username: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const data = nasabahs.map((n) => ({
            id: n.id,
            namaNasabah: n.namaNasabah,
            alamat: n.alamat,
            telp: n.telp,
            saldoPoin: n.saldoPoin,
            foto: n.foto,
            user: {
                username: n.user.username,
                role: n.user.role,
            },
        }));
        return {
            message: 'Daftar nasabah berhasil diambil',
            data,
        };
    }
    async create(appMakerId, dto, fotoUrl) {
        const existing = await this.prisma.user.findFirst({
            where: {
                appMakerId,
                username: dto.username,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Username sudah digunakan pada database aplikasi Anda.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const photo = fotoUrl || dto.foto || null;
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    appMakerId,
                    username: dto.username,
                    password: hashedPassword,
                    role: client_1.Role.NASABAH,
                },
            });
            const nasabah = await tx.nasabah.create({
                data: {
                    userId: user.id,
                    appMakerId,
                    namaNasabah: dto.namaNasabah,
                    alamat: dto.alamat,
                    telp: dto.telp,
                    saldoPoin: 0,
                    foto: photo,
                },
            });
            return {
                id: nasabah.id,
                namaNasabah: nasabah.namaNasabah,
                alamat: nasabah.alamat,
                telp: nasabah.telp,
                saldoPoin: nasabah.saldoPoin,
                foto: nasabah.foto,
                user: {
                    username: user.username,
                    role: user.role,
                },
            };
        });
        return {
            message: 'Nasabah baru berhasil ditambahkan',
            data: result,
        };
    }
    async findOne(appMakerId, id) {
        const nasabah = await this.prisma.nasabah.findFirst({
            where: { id, appMakerId },
            include: {
                user: {
                    select: {
                        username: true,
                        role: true,
                    },
                },
            },
        });
        if (!nasabah) {
            throw new common_1.NotFoundException('Data nasabah tidak ditemukan.');
        }
        return {
            message: 'Detail nasabah berhasil diambil',
            data: {
                id: nasabah.id,
                namaNasabah: nasabah.namaNasabah,
                alamat: nasabah.alamat,
                telp: nasabah.telp,
                saldoPoin: nasabah.saldoPoin,
                foto: nasabah.foto,
                user: {
                    username: nasabah.user.username,
                    role: nasabah.user.role,
                },
                createdAt: nasabah.createdAt.toISOString(),
            },
        };
    }
    async update(appMakerId, id, dto, fotoUrl) {
        const existing = await this.prisma.nasabah.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Data nasabah tidak ditemukan.');
        }
        const nama = dto.namaLengkap || dto.namaNasabah || existing.namaNasabah;
        const telepon = dto.noTelepon || dto.telp || existing.telp;
        const alamat = dto.alamat || existing.alamat;
        const tanggalLahir = dto.tanggalLahir || existing.tanggalLahir;
        const photo = fotoUrl || dto.foto || existing.foto;
        const updated = await this.prisma.nasabah.update({
            where: { id },
            data: {
                namaNasabah: nama,
                telp: telepon,
                alamat,
                tanggalLahir,
                foto: photo,
            },
        });
        return {
            message: 'Data nasabah berhasil diperbarui',
            data: {
                id: updated.id,
                namaNasabah: updated.namaNasabah,
                alamat: updated.alamat,
                telp: updated.telp,
                saldoPoin: updated.saldoPoin,
            },
        };
    }
    async remove(appMakerId, id) {
        const existing = await this.prisma.nasabah.findFirst({
            where: { id, appMakerId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Data nasabah tidak ditemukan.');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.nasabah.delete({ where: { id } });
            await tx.user.delete({ where: { id: existing.userId } });
        });
        return {
            message: 'Data nasabah berhasil dihapus',
            data: {
                id,
            },
        };
    }
};
exports.NasabahService = NasabahService;
exports.NasabahService = NasabahService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NasabahService);
//# sourceMappingURL=nasabah.service.js.map