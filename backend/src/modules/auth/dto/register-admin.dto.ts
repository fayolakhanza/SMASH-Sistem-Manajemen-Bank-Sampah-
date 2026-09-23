import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterAdminBankDto {
  @IsString({ message: 'Username harus berupa string.' })
  @IsNotEmpty({ message: 'Username wajib diisi.' })
  username: string;

  @IsString({ message: 'Password harus berupa string.' })
  @IsNotEmpty({ message: 'Password wajib diisi.' })
  password: string;

  @IsString({ message: 'Nama unit harus berupa string.' })
  @IsNotEmpty({ message: 'Nama unit wajib diisi.' })
  namaUnit: string;

  @IsString({ message: 'Nama pengelola harus berupa string.' })
  @IsNotEmpty({ message: 'Nama pengelola wajib diisi.' })
  namaPengelola: string;

  @IsString({ message: 'Nomor telepon harus berupa string.' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi.' })
  telp: string;
}
