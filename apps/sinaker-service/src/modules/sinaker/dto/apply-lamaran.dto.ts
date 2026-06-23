import {
  IsOptional,
  IsString,
} from 'class-validator';

export class ApplyLamaranDto {
  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  portfolio_url?: string;
}