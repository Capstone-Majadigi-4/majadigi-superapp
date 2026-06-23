import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PanicDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'ambulans',
    'polisi',
    'damkar',
    'sar',
  ])
  kategori: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}