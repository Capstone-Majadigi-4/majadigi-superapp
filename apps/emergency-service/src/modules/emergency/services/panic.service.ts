import {
  Injectable,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { Instansi }
from '../entities/instansi.entity';

import { LaporanPanic }
from '../entities/laporan-panic.entity';

import { PanicDto }
from '../dto/panic.dto';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class PanicService {
  constructor(
    @InjectRepository(Instansi)
    private readonly instansiRepository:
      Repository<Instansi>,

    @InjectRepository(
      LaporanPanic,
    )
    private readonly laporanRepository:
      Repository<LaporanPanic>,
  ) {}

  async panic(
    userNik: string,
    dto: PanicDto,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    const instansi =
      await this.instansiRepository.findOne(
        {
          where: {
            kategori:
              dto.kategori,

            is_active: true,
          },
        },
      );

    if (!instansi) {
      return ResponseHelper.error(
        'Instansi tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    const laporan =
      this.laporanRepository.create(
        {
          user_nik:
            userNik,

          kategori:
            dto.kategori,

          latitude:
            dto.latitude,

          longitude:
            dto.longitude,

          deskripsi:
            dto.deskripsi,

          dikirim_ke:
            instansi.nama,

          webhook_status:
            'delivered',
        },
      );

    await this.laporanRepository.save(
      laporan,
    );

    return ResponseHelper.success(
      'Laporan darurat berhasil dikirim',
      {
        id: laporan.id,

        kategori:
          laporan.kategori,

        lokasi: {
          latitude:
            laporan.latitude,

          longitude:
            laporan.longitude,
        },

        dikirim_ke:
          laporan.dikirim_ke,

        status:
          laporan.webhook_status,

        estimasi_respon:
          '5 menit',

        created_at:
          laporan.created_at,
      },
    );
  }
}