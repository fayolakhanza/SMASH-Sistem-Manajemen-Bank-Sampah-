import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateKategoriSampahDto {
  @IsOptional()
  @IsString()
  namaKategori?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hargaPerKg?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  poinPerKg?: number;

  @IsOptional()
  @IsString()
  jenis?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
