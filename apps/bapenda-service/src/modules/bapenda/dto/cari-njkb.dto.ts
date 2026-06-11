import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CariNjkbDto {
  @IsNotEmpty({ message: 'jenis_kendaraan wajib diisi' })
  @IsString({ message: 'jenis_kendaraan harus berupa string' })
  jenis_kendaraan: string;

  @IsNotEmpty({ message: 'merk wajib diisi' })
  @IsString({ message: 'merk harus berupa string' })
  merk: string;

  @IsNotEmpty({ message: 'model wajib diisi' })
  @IsString({ message: 'model harus berupa string' })
  model: string;

  @IsNotEmpty({ message: 'tipe wajib diisi' })
  @IsString({ message: 'tipe harus berupa string' })
  tipe: string;

  @IsNotEmpty({ message: 'tahun wajib diisi' })
  @Type(() => Number)
  @IsInt({ message: 'tahun harus berupa bilangan bulat' })
  @Min(1900, { message: 'tahun tidak valid' })
  tahun: number;
}
