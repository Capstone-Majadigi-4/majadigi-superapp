import {
  Injectable,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { LaporanPanic }
from '../entities/laporan-panic.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(
      LaporanPanic,
    )
    private readonly laporanRepository:
      Repository<LaporanPanic>,
  ) {}

  async getAllLaporan(
    page = 1,
    limit = 10,
  ) {
    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (limit > 50) {
      limit = 50;
    }

    const [
      laporan,
      total,
    ] =
      await this.laporanRepository.findAndCount(
        {
          order: {
            created_at:
              'DESC',
          },

          skip:
            (page - 1) * limit,

          take:
            limit,
        },
      );

    const result =
      laporan.map((item) => ({
        id: item.id,

        user_nik:
          item.user_nik,

        kategori:
          item.kategori,

        lokasi: {
          latitude:
            Number(
              item.latitude,
            ),

          longitude:
            Number(
              item.longitude,
            ),
        },

        deskripsi:
          item.deskripsi,

        dikirim_ke:
          item.dikirim_ke,

        webhook_status:
          item.webhook_status,

        created_at:
          item.created_at,
      }));

    return ResponseHelper.paginate(
      'Data laporan berhasil diambil',

      result,

      {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    );
  }
}