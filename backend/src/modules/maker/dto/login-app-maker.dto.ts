import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAppMakerDto {
  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email wajib diisi.' })
  email: string;

  @IsString({ message: 'Password harus berupa string.' })
  @IsNotEmpty({ message: 'Password wajib diisi.' })
  password: string;
}
