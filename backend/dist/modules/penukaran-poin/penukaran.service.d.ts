import { PrismaService } from '../../prisma/prisma.service';
import { CreatePenukaranPoinDto, UpdateStatusPenukaranDto } from './dto/create-penukaran.dto';
export declare class PenukaranPoinService {
    private prisma;
    constructor(prisma: PrismaService);
    tukarPoin(appMakerId: string, nasabahId: string, dto: CreatePenukaranPoinDto): Promise<{
        message: string;
        data: {
            id: string;
            kodePenukaran: string;
            tanggal: string;
            hadiahId: string;
            poinTerpakai: number;
            sisaSaldoPoin: number;
            status: string;
            kodeVoucher: string | null;
            hadiah: {
                namaHadiah: string;
            };
        };
    }>;
    getMyPenukaran(appMakerId: string, nasabahId: string): Promise<{
        message: string;
        data: {
            id: string;
            kodePenukaran: string;
            tanggal: string;
            poinTerpakai: number;
            status: string;
            kodeVoucher: string | undefined;
            hadiah: {
                namaHadiah: string;
                poinDibutuhkan: number;
                foto: string | null;
            };
        }[];
    }>;
    getAdminList(appMakerId: string, bulan?: string): Promise<{
        message: string;
        data: {
            id: string;
            kodePenukaran: string;
            tanggal: string;
            nasabah: {
                namaNasabah: string;
                telp: string;
            };
            hadiah: {
                namaHadiah: string;
            };
            poinTerpakai: number;
            status: string;
            kodeVoucher: string | undefined;
        }[];
    }>;
    updateStatus(appMakerId: string, id: string, dto: UpdateStatusPenukaranDto): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
        };
    }>;
    getNota(appMakerId: string, id: string, user: any): Promise<{
        message: string;
        data: {
            id: string;
            kodePenukaran: string;
            tanggal: string;
            nasabah: {
                namaNasabah: string;
                telp: string;
            };
            hadiah: {
                namaHadiah: string;
                poinDibutuhkan: number;
            };
            poinTerpakai: number;
            status: string;
            kodeVoucher: string | undefined;
        };
    }>;
}
