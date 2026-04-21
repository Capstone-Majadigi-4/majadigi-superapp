import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PoliService } from './poli.service';
import { success } from '../common/helpers/response.helper';

@Controller('rsud/poli')
export class PoliController {
  constructor(private readonly poliService: PoliService) {}

  @Get()
  async findAll() {
    const data = await this.poliService.findAll();
    return success(data, 'Daftar poli berhasil diambil');
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.poliService.findOne(id);
    return success(data);
  }
}
