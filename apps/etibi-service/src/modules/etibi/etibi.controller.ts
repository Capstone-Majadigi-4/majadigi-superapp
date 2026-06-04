import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';

import { ScreeningService }
from './services/screening.service';

import { AdherenceService }
from './services/adherence.service';

import { MonitoringService }
from './services/monitoring.service';

import { SubmitSkriningDto }
from './dto/submit-skrining.dto';

import { KonfirmasiObatDto }
from './dto/konfirmasi-obat.dto';

import { AdminGuard }
from '../../common/guards/admin.guard';

@Controller()
export class EtibiController {
  constructor(
    private readonly screeningService:
      ScreeningService,

    private readonly adherenceService:
      AdherenceService,

    private readonly monitoringService:
      MonitoringService,
  ) {}

  @Get('etibi/pertanyaan')
  async getPertanyaan() {
    return this.screeningService
      .getPertanyaan();
  }

  @Post('etibi/skrining')
  async submitSkrining(
    @Headers('x-user-nik')
    userNik: string,

    @Body()
    dto: SubmitSkriningDto,
  ) {
    console.log(
      'ETIBI userNik:',
      userNik,
    );

    return this.screeningService
      .submitSkrining(
        userNik,
        dto,
      );
  }

  @Get('etibi/hasil-skrining')
  async getRiwayatSkrining(
    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.screeningService
      .getRiwayatSkrining(
        userNik,
      );
  }

  @Post('etibi/konfirmasi-obat')
  async konfirmasiObat(
    @Headers('x-user-nik')
    userNik: string,

    @Body()
    dto: KonfirmasiObatDto,
  ) {
    return this.adherenceService
      .konfirmasiObat(
        userNik,
        dto,
      );
  }

  @Get('etibi/kalender-kepatuhan')
  async getKalenderKepatuhan(
    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.adherenceService
      .getKalenderKepatuhan(
        userNik,
      );
  }

  @Get('etibi/status-pengobatan')
  async getStatusPengobatan(
    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.adherenceService
      .getStatusPengobatan(
        userNik,
      );
  }

  @UseGuards(AdminGuard)
  @Get('etibi/admin/pasien')
  async getAdminPasien() {
    return this.monitoringService
      .getAdminPasien();
  }
}