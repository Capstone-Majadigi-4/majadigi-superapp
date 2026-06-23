import {
  Type,
} from 'class-transformer';

import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class JawabanDto {
  @IsUUID()
  pertanyaan_id: string;

  @IsBoolean()
  ya: boolean;
}

export class SubmitSkriningDto {
  @IsArray()

  @ArrayMinSize(1)

  @ValidateNested({
    each: true,
  })

  @Type(() => JawabanDto)
  jawaban: JawabanDto[];
}