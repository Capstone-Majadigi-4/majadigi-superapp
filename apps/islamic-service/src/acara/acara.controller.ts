import { Controller } from '@nestjs/common';
import { AcaraService } from './acara.service';

@Controller('acara')
export class AcaraController {
  constructor(private readonly acaraService: AcaraService) {}
}
