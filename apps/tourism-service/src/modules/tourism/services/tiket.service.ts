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

import { BeliTiketDto }
from '../dto/beli-tiket.dto';

@Injectable()
export class TiketService {
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

  async beliTiket(
    destinasiId: string,
    userNik: string,
    dto: BeliTiketDto,
  ) {
    const destinasi =
      await this.destinasiRepository.findOne(
        {
          where: {
            id: destinasiId,
            is_active: true,
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

    const total =
      dto.jumlah_dewasa *
        Number(
          destinasi.tiket_dewasa,
        ) +
      dto.jumlah_anak *
        Number(
          destinasi.tiket_anak,
        );

    const qrPayload =
      Buffer.from(
        JSON.stringify({
          destinasi_id:
            destinasi.id,

          user_nik:
            userNik,

          tanggal_kunjungan:
            dto.tanggal_kunjungan,

          total,
        }),
      ).toString('base64');

    const tiket =
      this.tiketRepository.create({
        user_nik:
          userNik,

        tanggal_kunjungan:
          new Date(
            dto.tanggal_kunjungan,
          ),

        jumlah_dewasa:
          dto.jumlah_dewasa,

        jumlah_anak:
          dto.jumlah_anak,

        total,

        qr_payload:
          qrPayload,

        status:
          'paid',

        destinasi,
      });

    await this.tiketRepository.save(
      tiket,
    );

    return ResponseHelper.success(
      'Tiket berhasil dibeli',
      {
        id: tiket.id,

        destinasi:
          destinasi.nama,

        tanggal_kunjungan:
          tiket.tanggal_kunjungan,

        jumlah_tiket: {
          dewasa:
            tiket.jumlah_dewasa,

          anak:
            tiket.jumlah_anak,
        },

        total,

        status:
          tiket.status,

        qr_payload:
          tiket.qr_payload,
      },
    );
  }

  async getTiketSaya(
    userNik: string,
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

    const [
      tiket,
      total,
    ] =
      await this.tiketRepository.findAndCount(
        {
          where: {
            user_nik:
              userNik,
          },

          relations: {
            destinasi: true,
          },

          order: {
            created_at:
              'DESC',
          },

          skip:
            (page - 1) * limit,

          take:
            limit,
        },
      );

    const result =
      tiket.map(
        (item) => ({
          id: item.id,

          destinasi: {
            id: item.destinasi.id,

            nama:
              item.destinasi.nama,

            kota:
              item.destinasi.kota,
          },

          tanggal_kunjungan:
            item.tanggal_kunjungan,

          jumlah_tiket: {
            dewasa:
              item.jumlah_dewasa,

            anak:
              item.jumlah_anak,
          },

          total:
            Number(
              item.total,
            ),

          status:
            item.status,

          qr_payload:
            item.qr_payload,

          created_at:
            item.created_at,
        }),
      );

    return ResponseHelper.paginate(
      'Data tiket berhasil diambil',

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