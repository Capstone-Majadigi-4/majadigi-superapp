import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { PertanyaanSkrining }
from '../entities/pertanyaan-skrining.entity';

import { HasilSkrining }
from '../entities/hasil-skrining.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

import { SubmitSkriningDto }
from '../dto/submit-skrining.dto';

@Injectable()
export class ScreeningService {
  constructor(
    @InjectRepository(
      PertanyaanSkrining,
    )
    private readonly pertanyaanRepository:
      Repository<PertanyaanSkrining>,

    @InjectRepository(
      HasilSkrining,
    )
    private readonly hasilRepository:
      Repository<HasilSkrining>,
  ) {}

  async getPertanyaan() {
    const pertanyaan =
      await this.pertanyaanRepository.find(
        {
          where: {
            is_active: true,
          },

          order: {
            urutan: 'ASC',
          },
        },
      );

    const result =
      pertanyaan.map(
        (item) => ({
          id: item.id,

          teks:
            item.teks,

          bobot:
            item.bobot,

          urutan:
            item.urutan,
        }),
      );

    return ResponseHelper.success(
      'Data pertanyaan berhasil diambil',
      result,
    );
  }

  async submitSkrining(
    userNik: string,
    dto: SubmitSkriningDto,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    let totalSkor = 0;

    for (const item of dto.jawaban) {
      if (!item.ya) {
        continue;
      }

      const pertanyaan =
        await this.pertanyaanRepository.findOne(
          {
            where: {
              id:
                item.pertanyaan_id,
            },
          },
        );

      if (pertanyaan) {
        totalSkor +=
          pertanyaan.bobot;
      }
    }

    let kategori =
      'rendah';

    let perluFollowup =
      false;

    if (
      totalSkor >= 4 &&
      totalSkor <= 6
    ) {
      kategori =
        'sedang';

      perluFollowup =
        true;
    }

    if (totalSkor >= 7) {
      kategori =
        'tinggi';

      perluFollowup =
        true;
    }

    const hasil =
      this.hasilRepository.create({
        user_nik:
          userNik,

        skor:
          totalSkor,

        kategori_risiko:
          kategori,

        perlu_followup:
          perluFollowup,
      });

    await this.hasilRepository.save(
      hasil,
    );

    return ResponseHelper.success(
      'Skrining berhasil',
      {
        skor:
          totalSkor,

        kategori_risiko:
          kategori,

        perlu_followup:
          perluFollowup,
      },
    );
  }

  async getRiwayatSkrining(
    userNik: string,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    const hasil =
      await this.hasilRepository.find(
        {
          where: {
            user_nik:
              userNik,
          },

          order: {
            created_at:
              'DESC',
          },
        },
      );

    const result =
      hasil.map((item) => ({
        skor:
          item.skor,

        kategori_risiko:
          item.kategori_risiko,

        perlu_followup:
          item.perlu_followup,

        created_at:
          item.created_at,
      }));

    return ResponseHelper.success(
      'Riwayat skrining berhasil diambil',
      result,
    );
  }
}