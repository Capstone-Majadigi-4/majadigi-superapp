import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { Lamaran }
from '../entities/lamaran.entity';

import { Lowongan }
from '../entities/lowongan.entity';

import { ProfilPencari }
from '../entities/profil-pencari.entity';

import { ApplyLamaranDto }
from '../dto/apply-lamaran.dto';

import { UpdateStatusLamaranDto }
from '../dto/update-status-lamaran.dto';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

import { MatchingHelper }
from '../../../common/helpers/matching.helper';

import { MaskingHelper }
from '../../../common/helpers/masking.helper';

@Injectable()
export class LamaranService {
  constructor(
    @InjectRepository(Lamaran)
    private readonly lamaranRepository:
      Repository<Lamaran>,

    @InjectRepository(Lowongan)
    private readonly lowonganRepository:
      Repository<Lowongan>,

    @InjectRepository(ProfilPencari)
    private readonly profilRepository:
      Repository<ProfilPencari>,
  ) {}

  async applyLamaran(
    lowonganId: string,
    dto: ApplyLamaranDto,
    userNik: string,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    const lowongan =
      await this.lowonganRepository.findOne(
        {
          where: {
            id: lowonganId,
            status: 'aktif',
          },
        },
      );

    if (!lowongan) {
      return ResponseHelper.error(
        'Lowongan tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    const profil =
      await this.profilRepository.findOne(
        {
          where: {
            user_nik:
              userNik,
          },
        },
      );

    if (!profil) {
      return ResponseHelper.error(
        'Profil pencari kerja belum lengkap',
        'PROFILE_NOT_FOUND',
        400,
      );
    }

    const existingLamaran =
      await this.lamaranRepository.findOne(
        {
          where: {
            user_nik:
              userNik,

            lowongan: {
              id: lowonganId,
            },
          },

          relations: {
            lowongan: true,
          },
        },
      );

    if (existingLamaran) {
      return ResponseHelper.error(
        'Anda sudah melamar lowongan ini',
        'ALREADY_APPLIED',
        400,
      );
    }

    const matchingScore =
      MatchingHelper.calculateMatchingScore(
        profil.skill || [],
        lowongan.kualifikasi || [],
      );

    const lamaran =
      this.lamaranRepository.create({
        user_nik:
          userNik,

        portfolio_url:
          dto.portfolio_url,

        catatan:
          dto.catatan,

        matching_score:
          matchingScore,

        status:
          'submitted',

        lowongan,
      });

    await this.lamaranRepository.save(
      lamaran,
    );

    return ResponseHelper.success(
      'Lamaran berhasil dikirim',
      {
        id: lamaran.id,

        status:
          lamaran.status,

        matching_score:
          matchingScore,

        lowongan:
          lowongan.judul,
      },
    );
  }

  async getRiwayatLamaran(
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

    const [lamaran, total] =
      await this.lamaranRepository.findAndCount({
        where: {
          user_nik:
            userNik,
        },

        relations: {
          lowongan: {
            perusahaan: true,
          },
        },

        order: {
          created_at:
            'DESC',
        },

        skip:
          (page - 1) * limit,

        take:
          limit,
      });

    const result = lamaran.map(
      (item) => ({
        id: item.id,

        lowongan:
          item.lowongan.judul,

        perusahaan:
          item.lowongan
            .perusahaan.nama,

        status:
          item.status,

        matching_score:
          item.matching_score,

        created_at:
          item.created_at,
      }),
    );

    return ResponseHelper.paginate(
      'Riwayat lamaran berhasil diambil',
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

  async updateStatusLamaran(
    id: string,
    dto: UpdateStatusLamaranDto,
  ) {
    const lamaran =
      await this.lamaranRepository.findOne(
        {
          where: {
            id,
          },
        },
      );

    if (!lamaran) {
      return ResponseHelper.error(
        'Lamaran tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    lamaran.status =
      dto.status;

    await this.lamaranRepository.save(
      lamaran,
    );

    return ResponseHelper.success(
      'Status lamaran berhasil diupdate',
      {
        id: lamaran.id,

        status:
          lamaran.status,
      },
    );
  }

  async getPelamarLowongan(
    lowonganId: string,
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

    const lowongan =
      await this.lowonganRepository.findOne(
        {
          where: {
            id: lowonganId,
          },
        },
      );

    if (!lowongan) {
      return ResponseHelper.error(
        'Lowongan tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    const [pelamar, total] =
      await this.lamaranRepository.findAndCount({
        where: {
          lowongan: {
            id: lowonganId,
          },
        },

        relations: {
          lowongan: true,
        },

        order: {
          matching_score:
            'DESC',

          created_at:
            'DESC',
        },

        skip:
          (page - 1) * limit,

        take:
          limit,
      });

    const result =
      pelamar.map((item) => ({
        id: item.id,

        user_nik:
          MaskingHelper.nik(
            item.user_nik,
          ),

        matching_score:
          item.matching_score,

        status:
          item.status,

        portfolio_url:
          item.portfolio_url,

        catatan:
          item.catatan,

        created_at:
          item.created_at,
      }));

    return ResponseHelper.paginate(
      'Data pelamar berhasil diambil',
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