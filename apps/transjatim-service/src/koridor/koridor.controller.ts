import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { KoridorService } from './koridor.service';
import { success } from '../common/helpers/response.helper';

@Controller('transjatim/koridor')
export class KoridorController {
  constructor(private readonly koridorService: KoridorService) {}

  @Get()
  async findAll() {
    const data = await this.koridorService.findAll();
    return success(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.koridorService.findOne(id);
    return success(data);
  }
}
