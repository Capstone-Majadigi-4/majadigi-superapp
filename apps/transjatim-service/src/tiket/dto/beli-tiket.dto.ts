import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class BeliTiketDto {
  @IsUUID()
  koridor_id!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  jumlah!: number;
}
