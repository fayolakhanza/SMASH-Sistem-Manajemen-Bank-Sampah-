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
exports.MakerService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
let MakerService = class MakerService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.appMaker.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email sudah terdaftar sebagai App Maker.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const appMaker = await this.prisma.appMaker.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                namaSiswa: dto.namaSiswa,
                kelas: dto.kelas,
                namaApp: dto.namaApp,
            },
        });
        const token = this.jwtService.sign({
            sub: appMaker.id,
            email: appMaker.email,
            type: 'APP_MAKER',
        });
        return {
            message: 'Registrasi App Maker berhasil! Simpan appKey berikut untuk dimasukkan di header x-app-key pada setiap request API frontend.',
            data: {
                id: appMaker.id,
                email: appMaker.email,
                namaSiswa: appMaker.namaSiswa,
                kelas: appMaker.kelas,
                namaApp: appMaker.namaApp,
                appKey: appMaker.appKey,
                token,
                createdAt: appMaker.createdAt.toISOString(),
            },
        };
    }
    async login(dto) {
        const appMaker = await this.prisma.appMaker.findUnique({
            where: { email: dto.email },
        });
        if (!appMaker) {
            throw new common_1.UnauthorizedException('Email atau password salah.');
        }
        const isMatch = await bcrypt.compare(dto.password, appMaker.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email atau password salah.');
        }
        const token = this.jwtService.sign({
            sub: appMaker.id,
            email: appMaker.email,
            type: 'APP_MAKER',
        });
        return {
            message: 'Login App Maker berhasil',
            data: {
                id: appMaker.id,
                email: appMaker.email,
                namaSiswa: appMaker.namaSiswa,
                kelas: appMaker.kelas,
                namaApp: appMaker.namaApp,
                appKey: appMaker.appKey,
                token,
            },
        };
    }
    async getProfile(appMakerId) {
        const appMaker = await this.prisma.appMaker.findUnique({
            where: { id: appMakerId },
        });
        if (!appMaker) {
            throw new common_1.NotFoundException('App Maker tidak ditemukan.');
        }
        const [totalNasabah, totalKategoriSampah, totalTransaksiSetor, totalHadiah] = await Promise.all([
            this.prisma.nasabah.count({ where: { appMakerId } }),
            this.prisma.kategoriSampah.count({ where: { appMakerId } }),
            this.prisma.setorSampah.count({ where: { appMakerId } }),
            this.prisma.hadiah.count({ where: { appMakerId } }),
        ]);
        return {
            message: 'Data profile App Maker berhasil diambil',
            data: {
                id: appMaker.id,
                email: appMaker.email,
                namaSiswa: appMaker.namaSiswa,
                kelas: appMaker.kelas,
                namaApp: appMaker.namaApp,
                appKey: appMaker.appKey,
                stats: {
                    totalNasabah,
                    totalKategoriSampah,
                    totalTransaksiSetor,
                    totalHadiah,
                },
            },
        };
    }
    async checkKey(email) {
        if (!email) {
            throw new common_1.BadRequestException('Query parameter email wajib disertakan.');
        }
        const appMaker = await this.prisma.appMaker.findUnique({
            where: { email },
        });
        if (!appMaker) {
            throw new common_1.NotFoundException('Akun App Maker dengan email tersebut tidak ditemukan.');
        }
        return {
            message: 'App Key ditemukan',
            data: {
                email: appMaker.email,
                namaSiswa: appMaker.namaSiswa,
                namaApp: appMaker.namaApp,
                appKey: appMaker.appKey,
            },
        };
    }
};
exports.MakerService = MakerService;
exports.MakerService = MakerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], MakerService);
//# sourceMappingURL=maker.service.js.map