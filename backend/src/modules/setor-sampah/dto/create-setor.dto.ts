import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

export class ItemSetorDto {
  @IsString({ message: 'kategoriSampahId harus berupa string UUID.' })
  @IsNotEmpty({ message: 'kategoriSampahId wajib diisi.' })
  kategoriSampahId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'berat harus berupa angka.' })
  berat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'beratKg harus berupa angka.' })
  beratKg?: number;

  @IsOptional()
  @IsString({ message: 'satuan harus berupa string (kg atau ton).' })
  satuan?: string; // 'kg' | 'ton'
}

export class CreateSetorSampahDto {
  @IsString({ message: 'Tanggal harus berupa string ISO 8601.' })
  @IsNotEmpty({ message: 'Tanggal wajib diisi.' })
  tanggal: string;

  @IsString({ message: 'Catatan harus berupa string.' })
  @IsNotEmpty({ message: 'Catatan wajib diisi.' })
  catatan: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => plainToInstance(ItemSetorDto, item));
        }
        return parsed;
      } catch {
        return value;
      }
    } else if (Array.isArray(value)) {
      return value.map((item) => plainToInstance(ItemSetorDto, item));
    }
    return value;
  })
  @IsArray({ message: 'items harus berupa array item setor.' })
  @ValidateNested({ each: true })
  @Type(() => ItemSetorDto)
  items?: ItemSetorDto[];

  @IsOptional()
  @IsString()
  fotoBukti?: string;
}
