import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAntreanDto {
  @IsUUID()
  poli_id!: string;

  @IsUUID()
  dokter_id!: string;

  @IsDateString()
  tanggal!: string;

  @IsOptional()
  @IsString()
  fcm_token?: string;
}
