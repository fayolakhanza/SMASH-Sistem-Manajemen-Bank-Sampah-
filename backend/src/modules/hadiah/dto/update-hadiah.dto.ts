import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHadiahDto {
  @IsOptional()
  @IsString()
  namaHadiah?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  poinDibutuhkan?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stok?: number;

  @IsOptional()
  @IsString()
  kategori?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
