export declare class ItemSetorDto {
    kategoriSampahId: string;
    berat?: number;
    beratKg?: number;
    satuan?: string;
}
export declare class CreateSetorSampahDto {
    tanggal: string;
    catatan: string;
    items?: ItemSetorDto[];
    fotoBukti?: string;
}
