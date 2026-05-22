import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import {
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

import { Pengumuman }
from '../entities/pengumuman.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class PengumumanService {
  constructor(
    @InjectRepository(Pengumuman)
    private readonly pengumumanRepository:
      Repository<Pengumuman>,
  ) {}

  async getPengumuman() {
    const today =
      new Date();

    const pengumuman =
      await this.pengumumanRepository.find({
        where: {
          aktif_dari:
            LessThanOrEqual(
              today,
            ),

          aktif_sampai:
            MoreThanOrEqual(
              today,
            ),
        },

        relations: {
          program: true,
        },

        order: {
          created_at:
            'DESC',
        },
      });

    const result =
      pengumuman.map((item) => ({
        judul:
          item.judul,

        isi:
          item.konten,

        program:
          item.program?.nama,

        aktif_dari:
          item.aktif_dari,

        aktif_sampai:
          item.aktif_sampai,
      }));

    return ResponseHelper.success(
      'Data pengumuman berhasil diambil',
      {
        pengumuman:
          result,
      },
    );
  }
}