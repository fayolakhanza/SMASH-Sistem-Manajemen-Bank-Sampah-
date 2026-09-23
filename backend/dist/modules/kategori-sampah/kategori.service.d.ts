import { PrismaService } from '../../prisma/prisma.service';
import { CreateKategoriSampahDto } from './dto/create-kategori.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori.dto';
export declare class KategoriSampahService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(appMakerId: string): Promise<{
        message: string;
        data: {
            id: string;
            foto: string | null;
            namaKategori: string;
            hargaPerKg: number;
            poinPerKg: number;
            jenis: string;
        }[];
    }>;
    create(appMakerId: string, dto: CreateKategoriSampahDto, fotoUrl?: string): Promise<{
        message: string;
        data: {
            id: string;
            namaKategori: string;
            hargaPerKg: number;
            poinPerKg: number;
            jenis: string;
            foto: string | null;
        };
    }>;
    findOne(appMakerId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
            namaKategori: string;
            hargaPerKg: number;
            poinPerKg: number;
            jenis: string;
            foto: string | null;
        };
    }>;
    update(appMakerId: string, id: string, dto: UpdateKategoriSampahDto, fotoUrl?: string): Promise<{
        message: string;
        data: {
            id: string;
            namaKategori: string;
            hargaPerKg: number;
            poinPerKg: number;
            jenis: string;
            foto: string | null;
        };
    }>;
    remove(appMakerId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
        };
    }>;
}
