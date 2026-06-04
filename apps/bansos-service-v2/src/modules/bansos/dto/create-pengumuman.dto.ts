import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreatePengumumanDto {
  @IsString()
  judul: string;

  @IsString()
  konten: string;

  @IsOptional()
  @IsUUID()
  program_id?: string;

  @IsDateString()
  aktif_dari: string;

  @IsDateString()
  aktif_sampai: string;
}