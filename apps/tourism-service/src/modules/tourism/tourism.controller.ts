import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { WisataService }
from './services/wisata.service';

import { TiketService }
from './services/tiket.service';

import { RuteService }
from './services/rute.service';

import { AdminService }
from './services/admin.service';

import { BeliTiketDto }
from './dto/beli-tiket.dto';

import { AdminGuard }
from '../../common/guards/admin.guard';

@Controller('wisata')
export class TourismController {
  constructor(
    private readonly wisataService:
      WisataService,

    private readonly tiketService:
      TiketService,

    private readonly ruteService:
      RuteService,

    private readonly adminService:
      AdminService,
  ) {}

  @Get()
  async getWisata(
    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,

    @Query('kategori')
    kategori?: string,

    @Query('kota')
    kota?: string,

    @Query('search')
    search?: string,
  ) {
    return this.wisataService
      .getWisata(
        Number(page) || 1,

        Number(limit) || 10,

        kategori,

        kota,

        search,
      );
  }

  @Get('tiket-saya')
  async getTiketSaya(
    @Headers('x-user-nik')
    userNik: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.tiketService
      .getTiketSaya(
        userNik,

        Number(page) || 1,

        Number(limit) || 10,
      );
  }

  @Get(':id')
  async getDetailWisata(
    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,
  ) {
    return this.wisataService
      .getDetailWisata(
        id,
      );
  }

  @Get(':id/rute-transjatim')
  async getRuteTransjatim(
    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,
  ) {
    return this.ruteService
      .getRuteTransjatim(
        id,
      );
  }

  @Post(':id/beli-tiket')
  async beliTiket(
    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,

    @Headers('x-user-nik')
    userNik: string,

    @Body()
    dto: BeliTiketDto,
  ) {
    return this.tiketService
      .beliTiket(
        id,
        userNik,
        dto,
      );
  }

  @UseGuards(
    AdminGuard,
  )
  @Post(
    'admin/tiket/scan',
  )
  async scanTiket(
    @Body()
    body: {
      qr_payload: string;
    },
  ) {
    return this.adminService
      .scanTiket(
        body.qr_payload,
      );
  }

  @UseGuards(
    AdminGuard,
  )
  @Put(
    'admin/:id',
  )
  async updateDestinasi(
    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,

    @Body()
    body: any,
  ) {
    return this.adminService
      .updateDestinasi(
        id,
        body,
      );
  }
}