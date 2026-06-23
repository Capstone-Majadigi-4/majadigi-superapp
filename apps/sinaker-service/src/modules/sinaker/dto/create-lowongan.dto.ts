import {
  IsString,
  IsArray,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateLowonganDto {
  @IsString()
  judul: string;

  @IsString()
  deskripsi: string;

  @IsArray()
  kualifikasi: string[];

  @IsString()
  kota: string;

  @IsString()
  tipe_kerja: string;

  @IsNumber()
  gaji_min: number;

  @IsNumber()
  gaji_max: number;

  @IsDateString()
  deadline: string;

  @IsString()
  perusahaan_id: string;
}