import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TiketService } from './tiket.service';
import { BeliTiketDto } from './dto/beli-tiket.dto';
import { ValidasiTiketDto } from './dto/validasi-tiket.dto';
import { success } from '../common/helpers/response.helper';

@Controller('transjatim/tiket')
export class TiketController {
  constructor(private readonly tiketService: TiketService) {}

  @Post()
  async beli(
    @Body() dto: BeliTiketDto,
    @Headers('x-user-nik') userNik: string,
  ) {
    const data = await this.tiketService.beli(dto, userNik);
    return success(data, 'Tiket berhasil dibeli', 201);
  }

  @Get()
  async findByUser(@Headers('x-user-nik') userNik: string) {
    const data = await this.tiketService.findByUser(userNik);
    return success(data);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-nik') userNik: string,
  ) {
    const data = await this.tiketService.findOne(id, userNik);
    return success(data);
  }

  @Post(':id/validasi')
  async validasi(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ValidasiTiketDto,
  ) {
    const data = await this.tiketService.validasi(id, dto);
    return success(data, data.pesan);
  }
}
