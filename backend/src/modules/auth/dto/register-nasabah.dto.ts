import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterNasabahBankDto {
  @IsString({ message: 'Username harus berupa string.' })
  @IsNotEmpty({ message: 'Username wajib diisi.' })
  username: string;

  @IsString({ message: 'Password harus berupa string.' })
  @IsNotEmpty({ message: 'Password wajib diisi.' })
  password: string;

  @IsString({ message: 'Nama nasabah harus berupa string.' })
  @IsNotEmpty({ message: 'Nama nasabah wajib diisi.' })
  namaNasabah: string;

  @IsString({ message: 'Alamat harus berupa string.' })
  @IsNotEmpty({ message: 'Alamat wajib diisi.' })
  alamat: string;

  @IsString({ message: 'Nomor telepon harus berupa string.' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi.' })
  telp: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
