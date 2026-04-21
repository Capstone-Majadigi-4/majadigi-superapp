import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { AntreanService } from './antrean.service';
import { CreateAntreanDto } from './dto/create-antrean.dto';
import { success } from '../common/helpers/response.helper';

@Controller('rsud')
export class AntreanController {
  constructor(private readonly antreanService: AntreanService) {}

  @Post('antrean')
  @HttpCode(201)
  async buat(
    @Body() dto: CreateAntreanDto,
    @Headers('x-user-nik') userNik: string,
  ) {
    const data = (await this.antreanService.createAntrean(dto, userNik))!;

    return success(
      {
        antrean_id: data.id,
        nomor_antrean: data.nomor_antrean,
        poli: data.poli?.nama,
        dokter: data.dokter?.nama,
        estimasi_jam: data.estimasi_jam,
        qr_checkin: data.qr_checkin,
        status: data.status,
      },
      'Antrean berhasil dibuat',
      201,
    );
  }

  @Get('antrean/:id/status')
  async getStatus(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.antreanService.getStatus(id);

    return success({
      antrean_id: data.id,
      nomor_antrean: data.nomor_antrean,
      poli: data.poli?.nama,
      dokter: data.dokter?.nama,
      estimasi_jam: data.estimasi_jam,
      status: data.status,
      dipanggil_at: data.dipanggil_at,
    });
  }

  @Post('webhook/panggilberikutnya')
  async panggilBerikutnya(@Body('poli_id', ParseUUIDPipe) poliId: string) {
    const data = (await this.antreanService.panggilBerikutnya(poliId))!;

    return success(
      {
        nomor_dipanggil: data.nomor_antrean,
        poli: data.poli?.nama,
        dipanggil_at: data.dipanggil_at,
      },
      'Antrean dipanggil',
    );
  }
}
