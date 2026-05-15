import { Controller, Get, Query } from '@nestjs/common';
import { KamarService } from './kamar.service';
import { success } from '../common/helpers/response.helper';

@Controller('rsud/kamar')
export class KamarController {
  constructor(private readonly kamarService: KamarService) {}

  @Get()
  async getKetersediaan(@Query('search') search?: string) {
    const data = await this.kamarService.getKetersediaan(search);
    return success(data);
  }
}
