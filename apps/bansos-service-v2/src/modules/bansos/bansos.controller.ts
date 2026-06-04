import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard }
from '../../common/guards/admin.guard';

import { PenerimaService }
from './services/penerima.service';

import { ProgramService }
from './services/program.service';

import { PengumumanService }
from './services/pengumuman.service';

import { AdminService }
from './services/admin.service';

import { CreatePengumumanDto }
from './dto/create-pengumuman.dto';

import { UpdatePengumumanDto }
from './dto/update-pengumuman.dto';

@Controller('bansos')
export class BansosController {
  constructor(
    private readonly penerimaService:
      PenerimaService,

    private readonly programService:
      ProgramService,

    private readonly pengumumanService:
      PengumumanService,

    private readonly adminService:
      AdminService,
  ) {}

  @Get('status-saya')
  async getStatus(
    @Headers('x-user-nik')
    nik: string,
  ) {
    return this.penerimaService
      .getStatus(nik);
  }

  @Get('program')
  async getProgram() {
    return this.programService
      .getProgramList();
  }

  @Get('pengumuman')
  async getPengumuman() {
    return this.pengumumanService
      .getPengumuman();
  }

  @UseGuards(AdminGuard)
  @Post('admin/sync')
  async syncData() {
    return this.adminService
      .syncData();
  }

  @UseGuards(AdminGuard)
  @Post('admin/pengumuman')
  async createPengumuman(
    @Body()
    dto: CreatePengumumanDto,
  ) {
    return this.adminService
      .createPengumuman(dto);
  }

  @UseGuards(AdminGuard)
  @Patch(
    'admin/pengumuman/:id',
  )
  async updatePengumuman(
    @Param('id')
    id: string,

    @Body()
    dto: UpdatePengumumanDto,
  ) {
    return this.adminService
      .updatePengumuman(
        id,
        dto,
      );
  }

  @UseGuards(AdminGuard)
  @Delete(
    'admin/pengumuman/:id',
  )
  async deletePengumuman(
    @Param('id')
    id: string,
  ) {
    return this.adminService
      .deletePengumuman(id);
  }
}