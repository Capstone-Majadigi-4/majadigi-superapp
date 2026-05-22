import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { KendaraanService }
from './services/kendaraan.service';

import { TagihanService }
from './services/tagihan.service';

import { PembayaranService }
from './services/pembayaran.service';

import { EtbpkbService }
from './services/etbpkb.service';

import { AdminService }
from './services/admin.service';

import { AdminGuard }
from '../../common/guards/admin.guard';

@Controller('bapenda')
export class BapendaController {
  constructor(
    private readonly kendaraanService:
      KendaraanService,

    private readonly tagihanService:
      TagihanService,

    private readonly pembayaranService:
      PembayaranService,

    private readonly etbpkbService:
      EtbpkbService,

    private readonly adminService:
      AdminService,
  ) {}

  @Get('kendaraan')
  async getKendaraan(
    @Headers()
    headers: Record<
      string,
      string
    >,
  ) {
    return this.kendaraanService
      .getKendaraan(
        headers[
          'x-user-nik'
        ],
      );
  }

  @Get('widget')
  async getWidget(
    @Headers()
    headers: Record<
      string,
      string
    >,
  ) {
    return this.kendaraanService
      .getWidget(
        headers[
          'x-user-nik'
        ],
      );
  }

  @Get('tagihan/:nopol')
  async getTagihanByNopol(
    @Param('nopol')
    nopol: string,

    @Headers()
    headers: Record<
      string,
      string
    >,
  ) {
    return this.tagihanService
      .getTagihanByNopol(
        nopol,

        headers[
          'x-user-nik'
        ],
      );
  }

  @Post(
    'tagihan/:nopol/bayar',
  )
  async bayarTagihan(
    @Param('nopol')
    nopol: string,

    @Headers()
    headers: Record<
      string,
      string
    >,

    @Body()
    body: {
      metode: string;
    },
  ) {
    return this.pembayaranService
      .bayarTagihan(
        nopol,

        headers[
          'x-user-nik'
        ],

        body.metode,
      );
  }

  @Post(
    'webhook/payment',
  )
  async paymentWebhook(
    @Body()
    body: {
      kode_bayar: string;

      status: string;
    },
  ) {
    return this.pembayaranService
      .paymentWebhook(
        body.kode_bayar,
        body.status,
      );
  }

  @Get('pembayaran')
  async getRiwayatPembayaran(
    @Headers()
    headers: Record<
      string,
      string
    >,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.pembayaranService
      .getRiwayatPembayaran(
        headers[
          'x-user-nik'
        ],

        Number(page) || 1,

        Number(limit) || 10,
      );
  }

  @Get('etbpkp/:kodeBayar')
  async getETBPKP(
    @Param('kodeBayar')
    kodeBayar: string,
  ) {
    return this.etbpkbService
      .getETBPKP(
        kodeBayar,
      );
  }

  @UseGuards(
    AdminGuard,
  )
  @Get('admin/rekap')
  async getRekapTransaksi(
    @Query('page')
    page = '1',

    @Query('limit')
    limit = '10',

    @Query('status')
    status?: string,

    @Query('search')
    search?: string,
  ) {
    return this.adminService
      .getRekapTransaksi(
        Number(page),

        Number(limit),

        status,

        search,
      );
  }
}