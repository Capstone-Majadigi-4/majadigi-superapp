import { Controller } from '@nestjs/common';
import { AntreanService } from './antrean.service';

@Controller('antrean')
export class AntreanController {
  constructor(private readonly antreanService: AntreanService) {}
}
