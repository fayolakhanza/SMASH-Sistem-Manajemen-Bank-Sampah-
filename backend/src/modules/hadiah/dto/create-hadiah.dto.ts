import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHadiahDto {
  @IsString({ message: 'Nama hadiah harus berupa string.' })
  @IsNotEmpty({ message: 'Nama hadiah wajib diisi.' })
  namaHadiah: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'poinDibutuhkan harus berupa angka.' })
  @IsNotEmpty({ message: 'poinDibutuhkan wajib diisi.' })
  poinDibutuhkan: number;

  @Type(() => Number)
  @IsInt({ message: 'stok harus berupa bilangan bulat.' })
  @IsNotEmpty({ message: 'stok wajib diisi.' })
  stok: number;

  @IsOptional()
  @IsString()
  kategori?: string; // 'fisik' | 'digital'

  @IsOptional()
  @IsString()
  foto?: string;
}
