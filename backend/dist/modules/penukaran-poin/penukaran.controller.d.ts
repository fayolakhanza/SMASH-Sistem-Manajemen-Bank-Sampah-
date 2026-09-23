import { PenukaranPoinService } from './penukaran.service';
import { CreatePenukaranPoinDto, UpdateStatusPenukaranDto } from './dto/create-penukaran.dto';
export declare class PenukaranPoinController {
    private readonly penukaranService;
    constructor(penukaranService: PenukaranPoinService);
    tukarPoin(appMakerId: string, user: any, dto: CreatePenukaranPoinDto): Promise<{
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
    getMyPenukaran(appMakerId: string, user: any): Promise<{
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
    getNota(appMakerId: string, user: any, id: string): Promise<{
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
