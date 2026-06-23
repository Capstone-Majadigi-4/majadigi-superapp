import { IsString } from 'class-validator';

export class TolakBookingDto {
  @IsString()
  catatan_admin!: string;
}
