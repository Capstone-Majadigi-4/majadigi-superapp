
import { Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional, Min, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFasilitasDto {
  @IsString()
  @IsNotEmpty()
  nama!: string;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNotEmpty()
  kapasitas!: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  harga_per_hari!: number;

  @IsString()
  @IsNotEmpty()
  deskripsi!: string;

  @IsOptional()
  @IsString()
  foto_url!: string;
}
