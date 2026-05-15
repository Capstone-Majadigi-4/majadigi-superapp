import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AcaraService } from './acara.service';
import { success } from '../common/helpers/response.helper';

@Controller('islamic/acara')
export class AcaraController {
  constructor(private readonly acaraService: AcaraService) {}

  @Get()
  async findAll(
    @Query('tanggal') tanggal?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.acaraService.findAll(tanggal, status);
    return success(data);
  }

  @Get('pendaftaran/saya')
  async riwayatSaya(@Headers('x-user-nik') userNik: string) {
    const data = await this.acaraService.riwayatSaya(userNik);
    return success(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.acaraService.findOne(id);
    return success(data);
  }

  @Post(':id/daftar')
  async daftar(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-nik') userNik: string,
  ) {
    const data = await this.acaraService.daftar(id, userNik);
    return success(data, 'Pendaftaran berhasil', 201);
  }
}
