import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TagihanPajak } from '../entities/tagihan-pajak.entity';

@Injectable()
export class TagihanService {
  constructor(
    @InjectRepository(TagihanPajak)
    private readonly tagihanPajakRepository: Repository<TagihanPajak>,
  ) {}

  async getTagihanByNopol(nopol: string, nik: string) {
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
      return {
        status: 'error',

        message: 'Tagihan tidak ditemukan',

        error: 'NOT_FOUND',

        code: 404,
      };
    }

    return {
      status: 'success',

      message: 'Detail tagihan berhasil diambil',

      data: {
        nopol: tagihan.kendaraan.nopol,

        merk_tipe: `${tagihan.kendaraan.merk} ${tagihan.kendaraan.tipe}`,

        periode: tagihan.periode,

        pokok_pkb: tagihan.pokok_pkb,

        denda: tagihan.denda,

        adm_stnk: tagihan.adm_stnk,

        total: tagihan.total,

        jatuh_tempo: tagihan.jatuh_tempo.toISOString().split('T')[0],

        status: tagihan.status,
      },
    };
  }
}
