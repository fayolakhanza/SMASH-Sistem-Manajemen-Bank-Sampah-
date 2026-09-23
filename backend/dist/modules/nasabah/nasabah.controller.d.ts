import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
export declare class NasabahController {
    private readonly nasabahService;
    constructor(nasabahService: NasabahService);
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
    create(appMakerId: string, dto: CreateNasabahDto, file: Express.Multer.File, req: any): Promise<{
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
    update(appMakerId: string, id: string, dto: UpdateNasabahDto, file: Express.Multer.File, req: any): Promise<{
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
