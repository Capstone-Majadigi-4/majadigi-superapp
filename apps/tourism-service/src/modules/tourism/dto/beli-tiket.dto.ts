import {
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class BeliTiketDto {
  @IsDateString()
  tanggal_kunjungan: string;

  @IsInt()
  @Min(0)
  jumlah_dewasa: number;

  @IsInt()
  @Min(0)
  jumlah_anak: number;
}