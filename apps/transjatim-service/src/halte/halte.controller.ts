import { Controller } from '@nestjs/common';
import { HalteService } from './halte.service';

@Controller('halte')
export class HalteController {
  constructor(private readonly halteService: HalteService) {}
}
