import { IsOptional, IsString } from 'class-validator';

export class UpdateNasabahDto {
  @IsOptional()
  @IsString()
  namaLengkap?: string;

  @IsOptional()
  @IsString()
  namaNasabah?: string;

  @IsOptional()
  @IsString()
  noTelepon?: string;

  @IsOptional()
  @IsString()
  telp?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  tanggalLahir?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
