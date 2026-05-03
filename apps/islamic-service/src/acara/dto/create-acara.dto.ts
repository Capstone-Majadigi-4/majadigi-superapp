import {
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  IsIn,
  Min,
} from 'class-validator';

export class CreateAcaraDto {
  @IsString()
  judul!: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsDateString()
  tanggal!: string;

  @IsOptional()
  @IsString()
  waktu_mulai?: string;

  @IsOptional()
  @IsString()
  waktu_selesai?: string;

  @IsOptional()
  @IsString()
  lokasi?: string;

  @IsInt()
  @Min(1)
  kuota_maksimal!: number;

  @IsOptional()
  @IsString()
  poster_url?: string;
}

export class UpdateAcaraDto {
  @IsOptional()
  @IsString()
  judul?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsDateString()
  tanggal?: string;

  @IsOptional()
  @IsString()
  waktu_mulai?: string;

  @IsOptional()
  @IsString()
  waktu_selesai?: string;

  @IsOptional()
  @IsString()
  lokasi?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  kuota_maksimal?: number;

  @IsOptional()
  @IsString()
  poster_url?: string;

  @IsOptional()
  @IsIn(['aktif', 'selesai', 'dibatalkan'])
  status?: string;
}
