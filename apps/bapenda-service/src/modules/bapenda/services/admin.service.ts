import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { TransaksiPembayaran } from '../entities/transaksi-pembayaran.entity';

import { ResponseHelper } from '../../../common/helpers/response.helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(TransaksiPembayaran)
    private readonly transaksiPembayaranRepository: Repository<TransaksiPembayaran>,
  ) {}

  async getRekapTransaksi(
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
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

    const where: FindOptionsWhere<TransaksiPembayaran>[] = [];

    if (search) {
      where.push({
        kode_bayar: ILike(`%${search}%`),

        ...(status && {
          status,
        }),
      });

      where.push({
        tagihan: {
          kendaraan: {
            nopol: ILike(`%${search}%`),
          },
        },

        ...(status && {
          status,
        }),
      });
    } else {
      where.push({
        ...(status && {
          status,
        }),
      });
    }

    const [transaksi, total] =
      await this.transaksiPembayaranRepository.findAndCount({
        where,

        relations: ['tagihan', 'tagihan.kendaraan'],

        order: {
          expired_at: 'DESC',
        },

        skip: (page - 1) * limit,

        take: limit,
      });

    const result = transaksi.map((item) => ({
      kode_bayar: item.kode_bayar,

      nopol: item.tagihan.kendaraan.nopol,

      metode: item.metode,

      total: item.total,

      status: item.status,

      expired_at: item.expired_at?.toISOString().split('T')[0],
    }));

    return ResponseHelper.paginate(
      'Data rekap transaksi berhasil diambil',

      result,

      {
        page,
        limit,
        total,

        totalPages: Math.ceil(total / limit),
      },
    );
  }
}
