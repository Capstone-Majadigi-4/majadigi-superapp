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

import { PanicService }
from './services/panic.service';

import { LaporanService }
from './services/laporan.service';

import { DispatchService }
from './services/dispatch.service';

import { AdminService }
from './services/admin.service';

import { PanicDto }
from './dto/panic.dto';

import { AdminGuard }
from '../../common/guards/admin.guard';

@Controller('darurat')
export class EmergencyController {
  constructor(
    private readonly panicService:
      PanicService,

    private readonly laporanService:
      LaporanService,

    private readonly dispatchService:
      DispatchService,

    private readonly adminService:
      AdminService,
  ) {}

  @Get('instansi')
  async getInstansi() {
    return this.dispatchService.getInstansi();
  }

  @Post('panic')
  async panic(
    @Headers('x-user-nik')
    userNik: string,

    @Body()
    dto: PanicDto,
  ) {
    return this.panicService.panic(
      userNik,
      dto,
    );
  }

  @Get('riwayat')
  async getRiwayat(
    @Headers('x-user-nik')
    userNik: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.laporanService.getRiwayat(
      userNik,

      Number(page) || 1,

      Number(limit) || 10,
    );
  }

  @Get('laporan/:id')
  async getDetail(
    @Param('id')
    id: string,

    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.laporanService.getDetail(
      id,
      userNik,
    );
  }

  @UseGuards(
    AdminGuard,
  )
  @Get('admin/laporan')
  async getAllLaporan(
    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.adminService.getAllLaporan(
      Number(page) || 1,

      Number(limit) || 10,
    );
  }
}