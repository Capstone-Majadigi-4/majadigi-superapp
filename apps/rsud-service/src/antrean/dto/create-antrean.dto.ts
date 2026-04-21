import { IsDateString, IsNumber } from 'class-validator';

export class CreateAntreanDto {
    @IsNumber()
    poli_id!: number;

    @IsNumber()
    dokter_id!: number;

    @IsDateString()
    tanggal!: string;
}