import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VerifyItemSetorDto {
  @IsString({ message: 'kategoriSampahId harus berupa string UUID.' })
  @IsNotEmpty({ message: 'kategoriSampahId wajib diisi.' })
  kategoriSampahId: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'beratKgReal harus berupa angka.' })
  @IsNotEmpty({ message: 'beratKgReal wajib diisi.' })
  beratKgReal: number;
}

export class VerifySetorSampahDto {
  @IsString({ message: 'Status harus berupa string.' })
  @IsNotEmpty({ message: 'Status wajib diisi.' })
  status: string; // 'diverifikasi' | 'ditolak' | 'selesai'

  @IsOptional()
  @IsString({ message: 'catatanAdmin harus berupa string.' })
  catatanAdmin?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifyItemSetorDto)
  itemsReal?: VerifyItemSetorDto[];
}
