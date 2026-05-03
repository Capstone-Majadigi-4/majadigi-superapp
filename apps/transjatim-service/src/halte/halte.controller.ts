import { Controller, Get, Query } from '@nestjs/common';
import { HalteService } from './halte.service';
import { FindTerdekatDto } from './dto/find-terdekat.dto';

@Controller('transjatim/halte')
export class HalteController {
  constructor(private readonly halteService: HalteService) {}

  @Get('terdekat')
  findTerdekat(@Query() dto: FindTerdekatDto) {
    return this.halteService.findTerdekat(dto);
  }
}
