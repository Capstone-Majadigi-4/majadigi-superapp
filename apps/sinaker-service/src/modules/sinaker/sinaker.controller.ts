import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Headers,
  UseGuards,
  Query,
} from '@nestjs/common';

import { AdminGuard }
from '../../common/guards/admin.guard';

import { LowonganService }
from './services/lowongan.service';

import { LamaranService }
from './services/lamaran.service';

import { ProfilService }
from './services/profil.service';

import { AdminService }
from './services/admin.service';

import { ApplyLamaranDto }
from './dto/apply-lamaran.dto';

import { SaveProfilDto }
from './dto/save-profil.dto';

import { CreateLowonganDto }
from './dto/create-lowongan.dto';

import { UpdateStatusLamaranDto }
from './dto/update-status-lamaran.dto';

@Controller()
export class SinakerController {
  constructor(
    private readonly lowonganService:
      LowonganService,

    private readonly lamaranService:
      LamaranService,

    private readonly profilService:
      ProfilService,

    private readonly adminService:
      AdminService,
  ) {}

  @Get('sinaker/lowongan')
  async getLowongan(
    @Query('page')
    page = '1',

    @Query('limit')
    limit = '10',
  ) {
    return this.lowonganService
      .getLowongan(
        Number(page),
        Number(limit),
      );
  }

  @Get(
    'sinaker/lowongan/:id',
  )
  async getDetailLowongan(
    @Param('id')
    id: string,
  ) {
    return this.lowonganService
      .getDetailLowongan(
        id,
      );
  }

  @UseGuards(AdminGuard)
  @Post(
    'sinaker/admin/lowongan',
  )
  async createLowongan(
    @Body()
    dto: CreateLowonganDto,
  ) {
    return this.adminService
      .createLowongan(
        dto,
      );
  }

  @Post(
    'sinaker/lowongan/:id/lamar',
  )
  async applyLamaran(
    @Param('id')
    id: string,

    @Body()
    dto: ApplyLamaranDto,

    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.lamaranService
      .applyLamaran(
        id,
        dto,
        userNik,
      );
  }

  @Get(
    'sinaker/lamaran',
  )
  async getRiwayatLamaran(
    @Headers('x-user-nik')
    userNik: string,

    @Query('page')
    page = '1',

    @Query('limit')
    limit = '10',
  ) {
    return this.lamaranService
      .getRiwayatLamaran(
        userNik,
        Number(page),
        Number(limit),
      );
  }

  @UseGuards(AdminGuard)
  @Patch(
    'sinaker/admin/lamaran/:id',
  )
  async updateStatusLamaran(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateStatusLamaranDto,
  ) {
    return this.adminService
      .updateStatusLamaran(
        id,
        dto,
      );
  }

  @UseGuards(AdminGuard)
  @Get(
    'sinaker/admin/lowongan/:id/pelamar',
  )
  async getPelamarLowongan(
    @Param('id')
    id: string,

    @Query('page')
    page = '1',

    @Query('limit')
    limit = '10',
  ) {
    return this.adminService
      .getPelamarLowongan(
        id,
        Number(page),
        Number(limit),
      );
  }

  @Get(
    'sinaker/profil',
  )
  async getProfil(
    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.profilService
      .getProfil(
        userNik,
      );
  }

  @Post(
    'sinaker/profil',
  )
  async saveProfil(
    @Body()
    dto: SaveProfilDto,

    @Headers('x-user-nik')
    userNik: string,
  ) {
    return this.profilService
      .saveProfil(
        dto,
        userNik,
      );
  }
}