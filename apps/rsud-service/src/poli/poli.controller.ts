import { Controller } from '@nestjs/common';
import { PoliService } from './poli.service';

@Controller('poli')
export class PoliController {
  constructor(private readonly poliService: PoliService) {}
}
