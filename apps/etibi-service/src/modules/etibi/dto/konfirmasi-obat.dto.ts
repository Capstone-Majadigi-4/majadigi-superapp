import {
  IsISO8601,
} from 'class-validator';

export class KonfirmasiObatDto {
  @IsISO8601()
  timestamp_minum: string;
}