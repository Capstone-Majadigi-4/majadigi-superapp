import {
  IsString,
  IsNotEmpty,
  MinLength,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(16, 16, { message: 'NIK harus 16 digit' })
  @Matches(/^\d{16}$/, { message: 'NIK harus berupa 16 angka' })
  nik!: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor HP tidak boleh kosong' })
  no_hp!: string;

  @IsString()
  @IsNotEmpty({ message: 'FCM token tidak boleh kosong' })
  fcm_token!: string;
}
