import { Injectable } from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { PasienAktif }
from '../entities/pasien-aktif.entity';

import { LogKonfirmasi }
from '../entities/log-konfirmasi.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(
      PasienAktif,
    )
    private readonly pasienRepository:
      Repository<PasienAktif>,

    @InjectRepository(
      LogKonfirmasi,
    )
    private readonly logRepository:
      Repository<LogKonfirmasi>,
  ) {}

  async getAdminPasien() {
    const pasienList =
      await this.pasienRepository.find();

    const result =
      await Promise.all(
        pasienList.map(
          async (pasien) => {
            const totalHari =
              Math.floor(
                (
                  new Date().getTime() -
                  new Date(
                    pasien.tanggal_mulai,
                  ).getTime()
                ) /
                  (1000 *
                    60 *
                    60 *
                    24),
              ) + 1;

            const totalKonfirmasi =
              await this.logRepository.count(
                {
                  where: {
                    pasien: {
                      id: pasien.id,
                    },

                    dikonfirmasi:
                      true,
                  },

                  relations: [
                    'pasien',
                  ],
                },
              );

            const persentase =
              Math.min(
                Math.round(
                  (
                    totalKonfirmasi /
                    totalHari
                  ) * 100,
                ),
                100,
              );

            let status =
              'aktif';

            if (
              persentase < 50
            ) {
              status =
                'warning';
            }

            return {
              nama:
                pasien.nama,

              fase_pengobatan:
                pasien.fase_pengobatan,

              persentase_kepatuhan:
                persentase,

              status,
            };
          },
        ),
      );

    return ResponseHelper.success(
      'Data pasien berhasil diambil',
      result,
    );
  }
}