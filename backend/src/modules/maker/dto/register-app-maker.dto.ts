import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAppMakerDto {
  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email wajib diisi.' })
  email: string;

  @IsString({ message: 'Password harus berupa string.' })
  @IsNotEmpty({ message: 'Password wajib diisi.' })
  @MinLength(6, { message: 'Kata sandi minimal 6 karakter.' })
  password: string;

  @IsString({ message: 'Nama siswa harus berupa string.' })
  @IsNotEmpty({ message: 'Nama siswa wajib diisi.' })
  namaSiswa: string;

  @IsString({ message: 'Kelas harus berupa string.' })
  @IsNotEmpty({ message: 'Kelas wajib diisi.' })
  kelas: string;

  @IsString({ message: 'Nama app harus berupa string.' })
  @IsNotEmpty({ message: 'Nama app wajib diisi.' })
  namaApp: string;
}
