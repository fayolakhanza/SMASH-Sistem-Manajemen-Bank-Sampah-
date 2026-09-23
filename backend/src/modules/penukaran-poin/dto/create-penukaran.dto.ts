import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePenukaranPoinDto {
  @IsString({ message: 'hadiahId harus berupa string UUID.' })
  @IsNotEmpty({ message: 'hadiahId wajib diisi.' })
  hadiahId: string;
}

export class UpdateStatusPenukaranDto {
  @IsString({ message: 'Status harus berupa string.' })
  @IsNotEmpty({ message: 'Status wajib diisi.' })
  status: string; // 'diproses' | 'selesai'
}
