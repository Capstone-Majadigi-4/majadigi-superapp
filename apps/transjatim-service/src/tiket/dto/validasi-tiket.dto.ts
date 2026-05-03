import { IsString, Length } from 'class-validator';

export class ValidasiTiketDto {
  @IsString()
  @Length(6, 6)
  otp!: string; 
}
