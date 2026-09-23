import { PrismaService } from '../../prisma/prisma.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
export declare class NasabahService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(appMakerId: string): Promise<{
        message: string;
        data: {
            id: string;
            namaNasabah: string;
            alamat: string;
            telp: string;
            saldoPoin: number;
            foto: string | null;
            user: {
                username: string;
                role: import(".prisma/client").$Enums.Role;
            };
        }[];
    }>;
    create(appMakerId: string, dto: CreateNasabahDto, fotoUrl?: string): Promise<{
        message: string;
        data: {
            id: string;
            namaNasabah: string;
            alamat: string;
            telp: string;
            saldoPoin: number;
            foto: string | null;
            user: {
                username: string;
                role: import(".prisma/client").$Enums.Role;
            };
        };
    }>;
    findOne(appMakerId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
            namaNasabah: string;
            alamat: string;
            telp: string;
            saldoPoin: number;
            foto: string | null;
            user: {
                username: string;
                role: import(".prisma/client").$Enums.Role;
            };
            createdAt: string;
        };
    }>;
    update(appMakerId: string, id: string, dto: UpdateNasabahDto, fotoUrl?: string): Promise<{
        message: string;
        data: {
            id: string;
            namaNasabah: string;
            alamat: string;
            telp: string;
            saldoPoin: number;
        };
    }>;
    remove(appMakerId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
        };
    }>;
}
