import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        nasabah: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            appMakerId: string;
            namaNasabah: string;
            alamat: string;
            telp: string;
            foto: string | null;
            tanggalLahir: string | null;
            saldoPoin: number;
            userId: string;
        } | null;
        adminBank: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            appMakerId: string;
            telp: string;
            namaUnit: string;
            namaPengelola: string;
            userId: string;
        } | null;
    } & {
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        appMakerId: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
export {};
