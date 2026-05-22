import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class UpdatePengumumanDto {
  @IsOptional()
  @IsString()
  judul?: string;

  @IsOptional()
  @IsString()
  konten?: string;

  @IsOptional()
  @IsUUID()
  program_id?: string;

  @IsOptional()
  @IsDateString()
  aktif_dari?: string;

  @IsOptional()
  @IsDateString()
  aktif_sampai?: string;
}