import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { Penerima }
from '../entities/penerima.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class PenerimaService {
  constructor(
    @InjectRepository(Penerima)
    private readonly penerimaRepository:
      Repository<Penerima>,
  ) {}

  async getStatus(
    nik: string,
  ) {
    const penerima =
      await this.penerimaRepository.find({
        where: {
          user_nik: nik,
        },

        relations: {
          program: true,
        },
      });

    if (!penerima.length) {
      return ResponseHelper.success(
        'Status bansos berhasil diambil',
        {
          eligible: false,

          pesan:
            'NIK Anda tidak terdaftar sebagai penerima',

          panduan: {
            judul:
              'Cara Daftar DTKS',

            langkah: [
              'Datang ke kelurahan',
              'Bawa KTP dan KK',
              'Isi formulir DTKS',
            ],
          },
        },
      );
    }

    const result =
      penerima.map((item) => ({
        nama:
          item.program.nama,

        nominal:
          Number(
            item.nominal,
          ),

        status_pencairan:
          item.status_pencairan,

        timeline: [
          {
            fase:
              'SP2D Diterbitkan',

            selesai:
              !!item.sp2d_at,
          },

          {
            fase:
              'Proses Bank',

            selesai:
              !!item.bank_at,
          },

          {
            fase:
              'Dana Cair',

            selesai:
              !!item.cair_at,
          },
        ],
      }));

    return ResponseHelper.success(
      'Status bansos berhasil diambil',
      {
        eligible: true,

        program: result,
      },
    );
  }
}