import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveProfilDto {
  @IsOptional()
  @IsString()
  ringkasan?: string;

  @IsOptional()
  @IsArray()
  skill?: string[];

@IsOptional()
@IsObject()
pendidikan?: any;

@IsOptional()
@IsObject()
pengalaman?: any;

  @IsOptional()
  @IsString()
  portfolio_url?: string;
}