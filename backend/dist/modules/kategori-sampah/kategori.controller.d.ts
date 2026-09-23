import { KategoriSampahService } from './kategori.service';
import { CreateKategoriSampahDto } from './dto/create-kategori.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori.dto';
export declare class KategoriSampahController {
    private readonly kategoriService;
    constructor(kategoriService: KategoriSampahService);
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
    create(appMakerId: string, dto: CreateKategoriSampahDto, file: Express.Multer.File, req: any): Promise<{
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
    update(appMakerId: string, id: string, dto: UpdateKategoriSampahDto, file: Express.Multer.File, req: any): Promise<{
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
