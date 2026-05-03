import { Controller } from '@nestjs/common';
import { FasilitasService } from './fasilitas.service';

@Controller('fasilitas')
export class FasilitasController {
  constructor(private readonly fasilitasService: FasilitasService) {}
}
