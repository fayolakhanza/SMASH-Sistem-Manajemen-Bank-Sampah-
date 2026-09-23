import { MakerService } from './maker.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
export declare class MakerController {
    private readonly makerService;
    constructor(makerService: MakerService);
    register(dto: RegisterAppMakerDto): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            namaSiswa: string;
            kelas: string;
            namaApp: string;
            appKey: string;
            token: string;
            createdAt: string;
        };
    }>;
    login(dto: LoginAppMakerDto): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            namaSiswa: string;
            kelas: string;
            namaApp: string;
            appKey: string;
            token: string;
        };
    }>;
    getProfile(makerId: string): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            namaSiswa: string;
            kelas: string;
            namaApp: string;
            appKey: string;
            stats: {
                totalNasabah: number;
                totalKategoriSampah: number;
                totalTransaksiSetor: number;
                totalHadiah: number;
            };
        };
    }>;
    checkKey(email: string): Promise<{
        message: string;
        data: {
            email: string;
            namaSiswa: string;
            namaApp: string;
            appKey: string;
        };
    }>;
}
