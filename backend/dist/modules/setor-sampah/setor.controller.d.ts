import { SetorSampahService } from './setor.service';
import { CreateSetorSampahDto } from './dto/create-setor.dto';
import { VerifySetorSampahDto } from './dto/verify-setor.dto';
export declare class SetorSampahController {
    private readonly setorService;
    constructor(setorService: SetorSampahService);
    createPengajuan(appMakerId: string, user: any, dto: CreateSetorSampahDto, file: Express.Multer.File, req: any): Promise<{
        message: string;
        data: {
            id: string;
            kodeSetor: string;
            tanggal: string;
            status: string;
            totalBeratKg: number;
            estimasiTotalPoin: number;
            totalPoin: number | null;
            catatan: string;
            detailSetors: {
                kategoriSampahId: string;
                beratKg: number;
                subtotalPoin: number;
                poinPerKg: number | null;
            }[];
        };
    }>;
    getMySetor(appMakerId: string, user: any, bulan?: string): Promise<{
        message: string;
        data: {
            id: string;
            kodeSetor: string;
            tanggal: string;
            status: string;
            totalBeratKg: number;
            totalPoin: number;
            estimasiTotalPoin: number;
            catatan: string;
            catatanAdmin: string | null;
            fotoBukti: string | null;
            detailSetors: {
                id: string;
                kategoriSampahId: string;
                beratKg: number;
                berat: number;
                subtotalPoin: number;
                poinPerKg: number | null;
                kategoriSampah: {
                    id: string;
                    namaKategori: string;
                    jenis: string;
                    poinPerKg: number;
                };
            }[];
        }[];
    }>;
    getAdminList(appMakerId: string, status?: string, bulan?: string): Promise<{
        message: string;
        data: {
            id: string;
            kodeSetor: string;
            tanggal: string;
            nasabah: {
                namaNasabah: string;
                telp: string;
            };
            status: string;
            totalBeratKg: number;
            totalPoin: number;
            estimasiTotalPoin: number;
            catatan: string;
            fotoBukti: string | null;
            catatanAdmin: string | null;
            detailSetors: {
                id: string;
                kategoriSampahId: string;
                beratKg: number;
                berat: number;
                poinPerKg: number | null;
                subtotalPoin: number;
                namaKategori: string;
                kategoriSampah: {
                    id: string;
                    namaKategori: string;
                    hargaPerKg: number;
                    poinPerKg: number;
                    jenis: string;
                };
            }[];
            items: {
                kategoriSampahId: string;
                namaKategori: string;
                berat: number;
                beratKg: number;
                poinPerKg: number | null;
            }[];
        }[];
    }>;
    getDetail(appMakerId: string, user: any, id: string): Promise<{
        message: string;
        data: {
            id: string;
            kodeSetor: string;
            tanggal: string;
            status: string;
            nasabah: {
                namaNasabah: string;
                alamat: string;
                telp: string;
            };
            totalBeratKg: number;
            totalPoin: number;
            estimasiTotalPoin: number;
            catatanAdmin: string | null;
            detailSetors: {
                kategoriSampahId: string;
                kategori: string;
                namaKategori: string;
                jenis: string;
                beratKg: number;
                berat: number;
                poinPerKg: number;
                subtotalPoin: number;
            }[];
            items: {
                kategoriSampahId: string;
                namaKategori: string;
                berat: number;
                beratKg: number;
                poinPerKg: number;
            }[];
        };
    }>;
    verify(appMakerId: string, id: string, dto: VerifySetorSampahDto): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            totalPoin: number | null;
            catatanAdmin: string | null;
        };
    }>;
}
