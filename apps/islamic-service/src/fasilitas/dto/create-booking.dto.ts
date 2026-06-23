import {
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  nama_acara!: string;

  @IsDateString()
  tanggal_mulai!: string;

  @IsDateString()
  tanggal_selesai!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  estimasi_peserta?: number;

  @IsOptional()
  @IsString()
  dokumen_url?: string;
}
