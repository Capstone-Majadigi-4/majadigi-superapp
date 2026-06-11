import { PartialType } from '@nestjs/swagger';
import { CreateKendaraanNjkbDto } from './create-kendaraan-njkb.dto';

export class UpdateKendaraanNjkbDto extends PartialType(
  CreateKendaraanNjkbDto,
) {}
