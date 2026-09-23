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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async registerNasabah(appMakerId, dto, fotoUrl) {
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
        const photo = fotoUrl ?? null;
        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    appMakerId,
                    username: dto.username,
                    password: hashedPassword,
                    role: client_1.Role.NASABAH,
                },
            });
            const newNasabah = await tx.nasabah.create({
                data: {
                    userId: newUser.id,
                    appMakerId,
                    namaNasabah: dto.namaNasabah,
                    alamat: dto.alamat,
                    telp: dto.telp,
                    saldoPoin: 0,
                    foto: photo,
                },
            });
            return {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                nasabah: {
                    id: newNasabah.id,
                    namaNasabah: newNasabah.namaNasabah,
                    alamat: newNasabah.alamat,
                    telp: newNasabah.telp,
                    saldoPoin: newNasabah.saldoPoin,
                    foto: newNasabah.foto,
                },
            };
        });
        return {
            message: 'Registrasi nasabah berhasil',
            data: user,
        };
    }
    async registerAdmin(appMakerId, dto) {
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
        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    appMakerId,
                    username: dto.username,
                    password: hashedPassword,
                    role: client_1.Role.ADMIN,
                },
            });
            const newAdmin = await tx.adminBank.create({
                data: {
                    userId: newUser.id,
                    appMakerId,
                    namaUnit: dto.namaUnit,
                    namaPengelola: dto.namaPengelola,
                    telp: dto.telp,
                },
            });
            return {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                adminBank: {
                    id: newAdmin.id,
                    namaUnit: newAdmin.namaUnit,
                    namaPengelola: newAdmin.namaPengelola,
                    telp: newAdmin.telp,
                },
            };
        });
        return {
            message: 'Pendaftaran unit Bank Sampah berhasil',
            data: user,
        };
    }
    async login(appMakerId, dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                appMakerId,
                username: dto.username,
            },
            include: {
                nasabah: true,
                adminBank: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Username atau password salah.');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Username atau password salah.');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            username: user.username,
            role: user.role,
            appMakerId,
        });
        return {
            statusCode: 201,
            success: true,
            message: `Login ${user.role} berhasil`,
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                nasabah: user.nasabah
                    ? {
                        id: user.nasabah.id,
                        namaNasabah: user.nasabah.namaNasabah,
                        alamat: user.nasabah.alamat,
                        telp: user.nasabah.telp,
                        saldoPoin: user.nasabah.saldoPoin,
                        foto: user.nasabah.foto,
                    }
                    : null,
                adminBank: user.adminBank
                    ? {
                        id: user.adminBank.id,
                        namaUnit: user.adminBank.namaUnit,
                        namaPengelola: user.adminBank.namaPengelola,
                        telp: user.adminBank.telp,
                    }
                    : null,
                token,
            },
        };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                nasabah: true,
                adminBank: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User tidak ditemukan.');
        }
        return {
            message: 'Data profile user berhasil diambil',
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                nasabah: user.nasabah
                    ? {
                        id: user.nasabah.id,
                        namaNasabah: user.nasabah.namaNasabah,
                        alamat: user.nasabah.alamat,
                        telp: user.nasabah.telp,
                        saldoPoin: user.nasabah.saldoPoin,
                        foto: user.nasabah.foto,
                    }
                    : null,
                adminBank: user.adminBank
                    ? {
                        id: user.adminBank.id,
                        namaUnit: user.adminBank.namaUnit,
                        namaPengelola: user.adminBank.namaPengelola,
                        telp: user.adminBank.telp,
                    }
                    : null,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map