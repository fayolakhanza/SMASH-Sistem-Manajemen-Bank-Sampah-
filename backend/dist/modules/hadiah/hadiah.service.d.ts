import { PrismaService } from '../../prisma/prisma.service';
import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';
export declare class HadiahService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(appMakerId: string): Promise<{
        message: string;
        data: {
            id: string;
            foto: string | null;
            namaHadiah: string;
            poinDibutuhkan: number;
            stok: number;
        }[];
    }>;
    create(appMakerId: string, dto: CreateHadiahDto, fotoUrl?: string): Promise<{
        message: string;
        data: {
            id: string;
            namaHadiah: string;
            poinDibutuhkan: number;
            stok: number;
            foto: string | null;
        };
    }>;
    findOne(appMakerId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
            namaHadiah: string;
            poinDibutuhkan: number;
            stok: number;
            foto: string | null;
        };
    }>;
    update(appMakerId: string, id: string, dto: UpdateHadiahDto, fotoUrl?: string): Promise<{
        message: string;
        data: {
            id: string;
            namaHadiah: string;
            poinDibutuhkan: number;
            stok: number;
        };
    }>;
    remove(appMakerId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
        };
    }>;
}
