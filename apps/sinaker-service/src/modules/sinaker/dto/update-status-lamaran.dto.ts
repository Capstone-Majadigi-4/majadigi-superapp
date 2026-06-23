import {
  IsIn,
  IsString,
} from 'class-validator';

export class UpdateStatusLamaranDto {
  @IsString()

  @IsIn([
    'submitted',
    'reviewed',
    'interview',
    'accepted',
    'rejected',
  ])
  status: string;
}