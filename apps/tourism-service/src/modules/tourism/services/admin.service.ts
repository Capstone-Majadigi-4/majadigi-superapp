import { Injectable }
from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { Destinasi }
from '../entities/destinasi.entity';

import { TiketPembelian }
from '../entities/tiket-pembelian.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(
      Destinasi,
    )
    private readonly destinasiRepository:
      Repository<Destinasi>,

    @InjectRepository(
      TiketPembelian,
    )
    private readonly tiketRepository:
      Repository<TiketPembelian>,
  ) {}

  async scanTiket(
    qrPayload: string,
  ) {
    const tiket =
      await this.tiketRepository.findOne(
        {
          where: {
            qr_payload:
              qrPayload,
          },

          relations: {
            destinasi: true,
          },
        },
      );

    if (!tiket) {
      return ResponseHelper.error(
        'Tiket tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    if (
      tiket.status ===
      'used'
    ) {
      return ResponseHelper.error(
        'Tiket sudah digunakan',
        'TICKET_ALREADY_USED',
        400,
      );
    }

    tiket.status =
      'used';

    await this.tiketRepository.save(
      tiket,
    );

    return ResponseHelper.success(
      'Tiket berhasil divalidasi',
      {
        tiket_id:
          tiket.id,

        destinasi:
          tiket.destinasi.nama,

        tanggal_kunjungan:
          tiket.tanggal_kunjungan,

        status:
          tiket.status,
      },
    );
  }

  async updateDestinasi(
    id: string,
    body: Partial<Destinasi>,
  ) {
    const destinasi =
      await this.destinasiRepository.findOne(
        {
          where: {
            id,
          },
        },
      );

    if (!destinasi) {
      return ResponseHelper.error(
        'Destinasi tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    Object.assign(
      destinasi,
      body,
    );

    await this.destinasiRepository.save(
      destinasi,
    );

    return ResponseHelper.success(
      'Destinasi berhasil diperbarui',
      {
        id: destinasi.id,

        nama:
          destinasi.nama,
      },
    );
  }
}