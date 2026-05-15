import { Controller, Get, Query } from '@nestjs/common';
import { HalteService } from './halte.service';
import { FindTerdekatDto } from './dto/find-terdekat.dto';
import { success } from '../common/helpers/response.helper';

@Controller('transjatim/halte')
export class HalteController {
  constructor(private readonly halteService: HalteService) {}

  @Get('terdekat')
  async findTerdekat(@Query() dto: FindTerdekatDto) {
    const data = await this.halteService.findTerdekat(dto);
    return success(data);
  }
}
