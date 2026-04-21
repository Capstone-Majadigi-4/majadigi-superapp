import { IsUUID, IsDateString } from 'class-validator';

export class CreateAntreanDto {
  @IsUUID()
  poli_id!: string;

  @IsUUID()
  dokter_id!: string;

  @IsDateString()
  tanggal!: string;
}
