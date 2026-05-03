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

@Controller('transjatim/tiket')
export class TiketController {
  constructor(private readonly tiketService: TiketService) {}

  @Post()
  beli(@Body() dto: BeliTiketDto, @Headers('x-user-nik') userNik: string) {
    return this.tiketService.beli(dto, userNik);
  }

  @Get()
  findByUser(@Headers('x-user-nik') userNik: string) {
    return this.tiketService.findByUser(userNik);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-nik') userNik: string,
  ) {
    return this.tiketService.findOne(id, userNik);
  }

  @Post(':id/validasi')
  validasi(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ValidasiTiketDto,
  ) {
    return this.tiketService.validasi(id, dto);
  }
}
