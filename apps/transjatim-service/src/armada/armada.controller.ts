import { Controller } from '@nestjs/common';
import { ArmadaService } from './armada.service';

@Controller('armada')
export class ArmadaController {
  constructor(private readonly armadaService: ArmadaService) {}
}
