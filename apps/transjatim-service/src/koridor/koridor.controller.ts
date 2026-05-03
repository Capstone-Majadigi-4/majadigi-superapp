import { Controller } from '@nestjs/common';
import { KoridorService } from './koridor.service';

@Controller('koridor')
export class KoridorController {
  constructor(private readonly koridorService: KoridorService) {}
}
