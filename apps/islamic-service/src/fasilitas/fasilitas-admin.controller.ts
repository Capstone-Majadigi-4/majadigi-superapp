import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FasilitasService } from './fasilitas.service';
import { CreateFasilitasDto } from './dto/create-fasilitas.dto';
import { TolakBookingDto } from './dto/tolak-booking.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { success } from '../common/helpers/response.helper';

@Controller('islamic/admin')
@UseGuards(AdminGuard)
export class FasilitasAdminController {
  constructor(private readonly fasilitasService: FasilitasService) {}

  @Post('fasilitas')
  async createFasilitas(@Body() dto: CreateFasilitasDto) {
    const data = await this.fasilitasService.createFasilitas(dto);
    return success(data, 'Fasilitas berhasil ditambahkan', 201);
  }

  @Get('booking')
  async findAllBooking(@Query('status') status?: string) {
    const data = await this.fasilitasService.findAllBooking(status);
    return success(data);
  }

  @Patch('booking/:id/approve')
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-admin-nik') adminNik: string,
  ) {
    const data = await this.fasilitasService.approveBooking(
      id,
      adminNik ?? 'admin',
    );
    return success(data, 'Booking disetujui');
  }

  @Patch('booking/:id/tolak')
  async tolak(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-admin-nik') adminNik: string,
    @Body() dto: TolakBookingDto,
  ) {
    const data = await this.fasilitasService.tolakBooking(
      id,
      adminNik ?? 'admin',
      dto,
    );
    return success(data, 'Booking ditolak');
  }
}
