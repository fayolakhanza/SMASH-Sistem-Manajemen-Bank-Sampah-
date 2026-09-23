import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Username harus berupa string.' })
  @IsNotEmpty({ message: 'Username wajib diisi.' })
  username: string;

  @IsString({ message: 'Password harus berupa string.' })
  @IsNotEmpty({ message: 'Password wajib diisi.' })
  password: string;
}
