import { Injectable }
from '@nestjs/common';

import { LowonganService }
from './lowongan.service';

import { LamaranService }
from './lamaran.service';

import { CreateLowonganDto }
from '../dto/create-lowongan.dto';

import { UpdateStatusLamaranDto }
from '../dto/update-status-lamaran.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly lowonganService:
      LowonganService,

    private readonly lamaranService:
      LamaranService,
  ) {}

  async createLowongan(
    dto: CreateLowonganDto,
  ) {
    return this.lowonganService
      .createLowongan(dto);
  }

  async updateStatusLamaran(
    id: string,
    dto: UpdateStatusLamaranDto,
  ) {
    return this.lamaranService
      .updateStatusLamaran(
        id,
        dto,
      );
  }

  async getPelamarLowongan(
    lowonganId: string,
    page = 1,
    limit = 10,
  ) {
    return this.lamaranService
      .getPelamarLowongan(
        lowonganId,
        page,
        limit,
      );
  }
}