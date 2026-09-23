import { AuthService } from './auth.service';
import { RegisterNasabahBankDto } from './dto/register-nasabah.dto';
import { RegisterAdminBankDto } from './dto/register-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerNasabah(appMakerId: string, dto: RegisterNasabahBankDto, file?: Express.Multer.File, req?: any): Promise<{
        message: string;
        data: {
            id: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            nasabah: {
                id: string;
                namaNasabah: string;
                alamat: string;
                telp: string;
                saldoPoin: number;
                foto: string | null;
            };
        };
    }>;
    registerAdmin(appMakerId: string, dto: RegisterAdminBankDto): Promise<{
        message: string;
        data: {
            id: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            adminBank: {
                id: string;
                namaUnit: string;
                namaPengelola: string;
                telp: string;
            };
        };
    }>;
    login(appMakerId: string, dto: LoginUserDto): Promise<{
        statusCode: number;
        success: boolean;
        message: string;
        data: {
            id: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            nasabah: {
                id: string;
                namaNasabah: string;
                alamat: string;
                telp: string;
                saldoPoin: number;
                foto: string | null;
            } | null;
            adminBank: {
                id: string;
                namaUnit: string;
                namaPengelola: string;
                telp: string;
            } | null;
            token: string;
        };
    }>;
    getMe(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            nasabah: {
                id: string;
                namaNasabah: string;
                alamat: string;
                telp: string;
                saldoPoin: number;
                foto: string | null;
            } | null;
            adminBank: {
                id: string;
                namaUnit: string;
                namaPengelola: string;
                telp: string;
            } | null;
        };
    }>;
}
