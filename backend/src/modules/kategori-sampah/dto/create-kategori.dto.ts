import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKategoriSampahDto {
  @IsString({ message: 'Nama kategori harus berupa string.' })
  @IsNotEmpty({ message: 'Nama kategori wajib diisi.' })
  namaKategori: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Harga per kg harus berupa angka.' })
  @IsNotEmpty({ message: 'Harga per kg wajib diisi.' })
  hargaPerKg: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Poin per kg harus berupa angka.' })
  @IsNotEmpty({ message: 'Poin per kg wajib diisi.' })
  poinPerKg: number;

  @IsString({ message: 'Jenis harus berupa string.' })
  @IsNotEmpty({ message: 'Jenis wajib diisi.' })
  jenis: string; 
  
  @IsOptional()
  @IsString()
  foto?: string;
}
