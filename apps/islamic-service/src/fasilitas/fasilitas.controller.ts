import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FasilitasService } from './fasilitas.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { success } from '../common/helpers/response.helper';

@Controller('islamic/fasilitas')
export class FasilitasController {
  constructor(private readonly fasilitasService: FasilitasService) {}

  @Get()
  async findAll() {
    const data = await this.fasilitasService.findAll();
    return success(data);
  }

  @Get('booking/saya')
  async riwayatSaya(@Headers('x-user-nik') userNik: string) {
    const data = await this.fasilitasService.riwayatSaya(userNik);
    return success(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.fasilitasService.findOne(id);
    return success(data);
  }

  @Post(':id/booking')
  async booking(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-nik') userNik: string,
    @Body() dto: CreateBookingDto,
  ) {
    const data = await this.fasilitasService.booking(id, userNik, dto);
    return success(data, 'Booking berhasil diajukan', 201);
  }
}
