import {
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

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
  estimasi_peserta?: number;

  @IsOptional()
  @IsString()
  dokumen_url?: string;
}
