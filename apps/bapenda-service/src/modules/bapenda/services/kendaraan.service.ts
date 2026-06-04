import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { Kendaraan }
from '../entities/kendaraan.entity';

@Injectable()
export class KendaraanService {
  constructor(
    @InjectRepository(Kendaraan)
    private readonly kendaraanRepository:
      Repository<Kendaraan>,
  ) {}

  async getKendaraan(
    nik: string,
  ) {
    if (!nik) {
      return {
        status: 'error',

        message:
          'User NIK tidak ditemukan',

        error:
          'UNAUTHORIZED',

        code: 401,
      };
    }

    const kendaraan =
      await this.kendaraanRepository.find({
        where: {
          nik_pemilik: nik,
        },
      });

    return {
      status: 'success',

      message:
        'Data kendaraan berhasil diambil',

      data: kendaraan,
    };
  }

  async getWidget(
    nik: string,
  ) {
    if (!nik) {
      return {
        status: 'error',

        message:
          'User NIK tidak ditemukan',

        error:
          'UNAUTHORIZED',

        code: 401,
      };
    }

    const kendaraan =
      await this.kendaraanRepository.find({
        where: {
          nik_pemilik: nik,
        },

        relations: [
          'tagihan',
        ],
      });

    const widget =
      kendaraan.flatMap(
        (item) =>
          item.tagihan.flatMap(
            (tagihan) => {
              const jatuhTempo =
                new Date(
                  tagihan.jatuh_tempo,
                );

              const today =
                new Date();

              const diffTime =
                jatuhTempo.getTime() -
                today.getTime();

              const sisaHari =
                Math.ceil(
                  diffTime /
                    (1000 *
                      60 *
                      60 *
                      24),
                );

              if (
                sisaHari > 30
              ) {
                return [];
              }

              if (
                tagihan.status !==
                'belum_bayar'
              ) {
                return [];
              }

              let levelAlert =
                'ok';

              if (
                sisaHari < 15
              ) {
                levelAlert =
                  'danger';
              } else if (
                sisaHari <= 30
              ) {
                levelAlert =
                  'warning';
              }

              return {
                nopol:
                  item.nopol,

                merk_tipe:
                  `${item.merk} ${item.tipe}`,

                jatuh_tempo:
                  tagihan.jatuh_tempo
                    .toISOString()
                    .split(
                      'T',
                    )[0],

                sisa_hari:
                  sisaHari,

                level_alert:
                  levelAlert,

                total_tagihan:
                  tagihan.total,
              };
            },
          ),
      );

    return {
      status: 'success',

      message:
        'Widget pajak berhasil diambil',

      data: widget,
    };
  }
}