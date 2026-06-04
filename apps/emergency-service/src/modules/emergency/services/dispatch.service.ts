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

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Instansi)
    private readonly instansiRepository:
      Repository<Instansi>,
  ) {}

  async getInstansi() {
    const instansi =
      await this.instansiRepository.find(
        {
          where: {
            is_active: true,
          },

          order: {
            nama: 'ASC',
          },
        },
      );

    const result =
      instansi.map((item) => ({
        id: item.id,

        nama:
          item.nama,

        kategori:
          item.kategori,

        nomor:
          item.nomor,

        nomor_cepat:
          item.nomor_cepat,

        kota:
          item.kota,

        provinsi:
          item.provinsi,

        aktif_24jam:
          item.aktif_24jam,
      }));

    return ResponseHelper.success(
      'Data instansi berhasil diambil',
      result,
    );
  }
}