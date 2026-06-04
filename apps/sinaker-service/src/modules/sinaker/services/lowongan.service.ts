import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { Lowongan }
from '../entities/lowongan.entity';

import { Perusahaan }
from '../entities/perusahaan.entity';

import { CreateLowonganDto }
from '../dto/create-lowongan.dto';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class LowonganService {
  constructor(
    @InjectRepository(Lowongan)
    private readonly lowonganRepository:
      Repository<Lowongan>,

    @InjectRepository(Perusahaan)
    private readonly perusahaanRepository:
      Repository<Perusahaan>,
  ) {}

  async getLowongan(
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

    const [lowongan, total] =
      await this.lowonganRepository.findAndCount({
        where: {
          status: 'aktif',
        },

        relations: {
          perusahaan: true,
        },

        skip:
          (page - 1) * limit,

        take:
          limit,

        order: {
          created_at:
            'DESC',
        },
      });

    const result = lowongan.map(
      (item) => ({
        id: item.id,

        judul:
          item.judul,

        perusahaan:
          item.perusahaan.nama,

        kota:
          item.kota,

        tipe_kerja:
          item.tipe_kerja,

        gaji: {
          min: Number(
            item.gaji_min,
          ),

          max: Number(
            item.gaji_max,
          ),
        },

        deadline:
          item.deadline,

        status:
          item.status,
      }),
    );

    return ResponseHelper.paginate(
      'Data lowongan berhasil diambil',
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

  async getDetailLowongan(
    id: string,
  ) {
    const lowongan =
      await this.lowonganRepository.findOne(
        {
          where: {
            id,
            status: 'aktif',
          },

          relations: {
            perusahaan: true,
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

    return ResponseHelper.success(
      'Detail lowongan berhasil diambil',
      {
        id: lowongan.id,

        judul:
          lowongan.judul,

        perusahaan:
          lowongan.perusahaan.nama,

        deskripsi:
          lowongan.deskripsi,

        kualifikasi:
          lowongan.kualifikasi,

        kota:
          lowongan.kota,

        tipe_kerja:
          lowongan.tipe_kerja,

        gaji: {
          min: Number(
            lowongan.gaji_min,
          ),

          max: Number(
            lowongan.gaji_max,
          ),
        },

        deadline:
          lowongan.deadline,

        status:
          lowongan.status,
      },
    );
  }

  async createLowongan(
    dto: CreateLowonganDto,
  ) {
    const perusahaan =
      await this.perusahaanRepository.findOne(
        {
          where: {
            id:
              dto.perusahaan_id,
          },
        },
      );

    if (!perusahaan) {
      return ResponseHelper.error(
        'Perusahaan tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    const lowongan =
      this.lowonganRepository.create({
        judul:
          dto.judul,

        deskripsi:
          dto.deskripsi,

        kualifikasi:
          dto.kualifikasi,

        kota:
          dto.kota,

        tipe_kerja:
          dto.tipe_kerja,

        gaji_min:
          dto.gaji_min,

        gaji_max:
          dto.gaji_max,

        deadline:
          dto.deadline as any,

        status:
          'aktif',

        perusahaan,
      });

    await this.lowonganRepository.save(
      lowongan,
    );

    return ResponseHelper.success(
      'Lowongan berhasil dibuat',
      {
        id: lowongan.id,

        judul:
          lowongan.judul,

        status:
          lowongan.status,
      },
    );
  }
}