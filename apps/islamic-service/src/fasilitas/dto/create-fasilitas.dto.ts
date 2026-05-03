import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateFasilitasDto {
  @IsString()
  nama!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  kapasitas?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  harga_per_hari?: number;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  foto_url?: string;
}
