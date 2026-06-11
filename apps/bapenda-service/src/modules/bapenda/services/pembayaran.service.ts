import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TagihanPajak } from '../entities/tagihan-pajak.entity';

import { TransaksiPembayaran } from '../entities/transaksi-pembayaran.entity';

import { ResponseHelper } from '../../../common/helpers/response.helper';

@Injectable()
export class PembayaranService {
  constructor(
    @InjectRepository(TagihanPajak)
    private readonly tagihanPajakRepository: Repository<TagihanPajak>,

    @InjectRepository(TransaksiPembayaran)
    private readonly transaksiPembayaranRepository: Repository<TransaksiPembayaran>,
  ) {}

  async bayarTagihan(nopol: string, nik: string, metode: string) {
    const tagihan = await this.tagihanPajakRepository.findOne({
      where: {
        kendaraan: {
          nopol,
          nik_pemilik: nik,
        },
      },

      relations: ['kendaraan'],
    });

    if (!tagihan) {
      return ResponseHelper.error('Tagihan tidak ditemukan', 'NOT_FOUND', 404);
    }

    const existingPayment = await this.transaksiPembayaranRepository.findOne({
      where: {
        tagihan: {
          id: tagihan.id,
        },

        status: 'pending',
      },

      relations: ['tagihan'],
    });

    if (existingPayment) {
      return ResponseHelper.error(
        'Masih ada pembayaran pending untuk tagihan ini',
        'PAYMENT_ALREADY_EXISTS',
        400,
      );
    }

    const kodeBayar = `VA-${Date.now()}`;

    const expiredAt = new Date();

    expiredAt.setHours(expiredAt.getHours() + 24);

    const pembayaran = this.transaksiPembayaranRepository.create({
      kode_bayar: kodeBayar,

      metode,

      bank_code: 'BCA',

      total: tagihan.total,

      status: 'pending',

      pg_reference: `PG-${Date.now()}`,

      expired_at: expiredAt,

      tagihan,
    });

    await this.transaksiPembayaranRepository.save(pembayaran);

    return ResponseHelper.success('Pembayaran berhasil dibuat', {
      kode_bayar: pembayaran.kode_bayar,

      metode: pembayaran.metode,

      total: pembayaran.total,

      status: pembayaran.status,

      expired_at: pembayaran.expired_at.toISOString().split('T')[0],
    });
  }

  async paymentWebhook(kodeBayar: string, status: string) {
    const pembayaran = await this.transaksiPembayaranRepository.findOne({
      where: {
        kode_bayar: kodeBayar,
      },

      relations: ['tagihan'],
    });

    if (!pembayaran) {
      return ResponseHelper.error(
        'Pembayaran tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    if (pembayaran.status === 'paid') {
      return ResponseHelper.error(
        'Pembayaran sudah pernah dikonfirmasi',
        'PAYMENT_ALREADY_PAID',
        400,
      );
    }

    pembayaran.status = status;

    await this.transaksiPembayaranRepository.save(pembayaran);

    if (status === 'paid') {
      pembayaran.tagihan.status = 'lunas';

      await this.tagihanPajakRepository.save(pembayaran.tagihan);
    }

    return ResponseHelper.success('Status pembayaran berhasil diperbarui', {
      kode_bayar: pembayaran.kode_bayar,

      status_pembayaran: pembayaran.status,

      status_tagihan: pembayaran.tagihan.status,
    });
  }

  async getRiwayatPembayaran(nik: string, page = 1, limit = 10) {
    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (limit > 50) {
      limit = 50;
    }

    const [pembayaran, total] =
      await this.transaksiPembayaranRepository.findAndCount({
        where: {
          tagihan: {
            kendaraan: {
              nik_pemilik: nik,
            },
          },
        },

        relations: ['tagihan', 'tagihan.kendaraan'],

        order: {
          expired_at: 'DESC',
        },

        skip: (page - 1) * limit,

        take: limit,
      });

    const result = pembayaran.map((item) => ({
      kode_bayar: item.kode_bayar,

      metode: item.metode,

      total: item.total,

      status: item.status,

      expired_at: item.expired_at.toISOString().split('T')[0],

      kendaraan: {
        nopol: item.tagihan.kendaraan.nopol,

        merk_tipe: `${item.tagihan.kendaraan.merk} ${item.tagihan.kendaraan.tipe}`,
      },

      tagihan: {
        periode: item.tagihan.periode,

        status: item.tagihan.status,
      },
    }));

    return ResponseHelper.paginate(
      'Riwayat pembayaran berhasil diambil',

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
