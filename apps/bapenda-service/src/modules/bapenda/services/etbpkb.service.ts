import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TransaksiPembayaran } from '../entities/transaksi-pembayaran.entity';

@Injectable()
export class EtbpkbService {
  constructor(
    @InjectRepository(TransaksiPembayaran)
    private readonly transaksiPembayaranRepository: Repository<TransaksiPembayaran>,
  ) {}

  async getETBPKP(kodeBayar: string) {
    const pembayaran = await this.transaksiPembayaranRepository.findOne({
      where: {
        kode_bayar: kodeBayar,
      },

      relations: ['tagihan', 'tagihan.kendaraan'],
    });

    if (!pembayaran) {
      return {
        status: 'error',

        message: 'Data pembayaran tidak ditemukan',

        error: 'NOT_FOUND',

        code: 404,
      };
    }

    if (pembayaran.status !== 'paid') {
      return {
        status: 'error',

        message: 'Pembayaran belum lunas',

        error: 'PAYMENT_NOT_PAID',

        code: 400,
      };
    }

    return {
      status: 'success',

      message: 'Data ETBPKP berhasil diambil',

      data: {
        nomor_etbpkp: `ETBPKP-${Date.now()}`,

        tanggal_bayar: new Date().toISOString().split('T')[0],

        kode_bayar: pembayaran.kode_bayar,

        kendaraan: {
          nopol: pembayaran.tagihan.kendaraan.nopol,

          merk_tipe: `${pembayaran.tagihan.kendaraan.merk} ${pembayaran.tagihan.kendaraan.tipe}`,

          tahun: pembayaran.tagihan.kendaraan.tahun,
        },

        tagihan: {
          periode: pembayaran.tagihan.periode,

          pokok_pkb: pembayaran.tagihan.pokok_pkb,

          denda: pembayaran.tagihan.denda,

          adm_stnk: pembayaran.tagihan.adm_stnk,

          total: pembayaran.tagihan.total,
        },

        pembayaran: {
          metode: pembayaran.metode,

          status: pembayaran.status,
        },
      },
    };
  }
}
