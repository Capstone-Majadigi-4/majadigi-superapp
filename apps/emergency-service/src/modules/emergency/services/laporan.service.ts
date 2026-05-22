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
export class LaporanService {
  constructor(
    @InjectRepository(
      LaporanPanic,
    )
    private readonly laporanRepository:
      Repository<LaporanPanic>,
  ) {}

  async getRiwayat(
    userNik: string,
    page = 1,
    limit = 10,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

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
          where: {
            user_nik:
              userNik,
          },

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

        status:
          item.webhook_status,

        created_at:
          item.created_at,
      }));

    return ResponseHelper.paginate(
      'Riwayat laporan berhasil diambil',

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

  async getDetail(
    id: string,
    userNik: string,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    const laporan =
      await this.laporanRepository.findOne(
        {
          where: {
            id,

            user_nik:
              userNik,
          },
        },
      );

    if (!laporan) {
      return ResponseHelper.error(
        'Laporan tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    return ResponseHelper.success(
      'Detail laporan berhasil diambil',
      {
        id: laporan.id,

        kategori:
          laporan.kategori,

        lokasi: {
          latitude:
            Number(
              laporan.latitude,
            ),

          longitude:
            Number(
              laporan.longitude,
            ),
        },

        deskripsi:
          laporan.deskripsi,

        dikirim_ke:
          laporan.dikirim_ke,

        status:
          laporan.webhook_status,

        created_at:
          laporan.created_at,
      },
    );
  }
}