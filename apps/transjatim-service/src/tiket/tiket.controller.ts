import { Controller } from '@nestjs/common';
import { TiketService } from './tiket.service';

@Controller('tiket')
export class TiketController {
  constructor(private readonly tiketService: TiketService) {}
}
