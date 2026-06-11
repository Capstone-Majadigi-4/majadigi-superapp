import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Kendaraan } from '../entities/kendaraan.entity';

import { KendaraanNjkb } from '../entities/kendaraan-njkb.entity';

import { ResponseHelper } from '../../../common/helpers/response.helper';

import { CreateKendaraanNjkbDto } from '../dto/create-kendaraan-njkb.dto';

import { UpdateKendaraanNjkbDto } from '../dto/update-kendaraan-njkb.dto';

import { CariNjkbDto } from '../dto/cari-njkb.dto';

@Injectable()
export class KendaraanService {
  constructor(
    @InjectRepository(Kendaraan)
    private readonly kendaraanRepository: Repository<Kendaraan>,

    @InjectRepository(KendaraanNjkb)
    private readonly njkbRepository: Repository<KendaraanNjkb>,
  ) {}

  async getKendaraan(nik: string) {
    if (!nik) {
      return {
        status: 'error',

        message: 'User NIK tidak ditemukan',

        error: 'UNAUTHORIZED',

        code: 401,
      };
    }

    const kendaraan = await this.kendaraanRepository.find({
      where: {
        nik_pemilik: nik,
      },
    });

    return {
      status: 'success',

      message: 'Data kendaraan berhasil diambil',

      data: kendaraan,
    };
  }

  async getWidget(nik: string) {
    if (!nik) {
      return {
        status: 'error',

        message: 'User NIK tidak ditemukan',

        error: 'UNAUTHORIZED',

        code: 401,
      };
    }

    const kendaraan = await this.kendaraanRepository.find({
      where: {
        nik_pemilik: nik,
      },

      relations: ['tagihan'],
    });

    const widget = kendaraan.flatMap((item) =>
      item.tagihan.flatMap((tagihan) => {
        const jatuhTempo = new Date(tagihan.jatuh_tempo);

        const today = new Date();

        const diffTime = jatuhTempo.getTime() - today.getTime();

        const sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (sisaHari > 30) {
          return [];
        }

        if (tagihan.status !== 'belum_bayar') {
          return [];
        }

        let levelAlert = 'ok';

        if (sisaHari < 15) {
          levelAlert = 'danger';
        } else if (sisaHari <= 30) {
          levelAlert = 'warning';
        }

        return {
          nopol: item.nopol,

          merk_tipe: `${item.merk} ${item.tipe}`,

          jatuh_tempo: tagihan.jatuh_tempo.toISOString().split('T')[0],

          sisa_hari: sisaHari,

          level_alert: levelAlert,

          total_tagihan: tagihan.total,
        };
      }),
    );

    return {
      status: 'success',

      message: 'Widget pajak berhasil diambil',

      data: widget,
    };
  }

  async getJenisKendaraan() {
    const result = await this.njkbRepository
      .createQueryBuilder('njkb')
      .select('DISTINCT njkb.jenis_kendaraan', 'jenis_kendaraan')
      .getRawMany();

    const data = (result as { jenis_kendaraan: string }[]).map(
      (r) => r.jenis_kendaraan,
    );
    return ResponseHelper.success('Data berhasil diambil', data);
  }

  async getMerkByJenis(jenis: string) {
    const result = await this.njkbRepository
      .createQueryBuilder('njkb')
      .select('DISTINCT njkb.merk', 'merk')
      .where('njkb.jenis_kendaraan = :jenis', { jenis })
      .getRawMany();

    const data = (result as { merk: string }[]).map((r) => r.merk);
    return ResponseHelper.success('Data berhasil diambil', data);
  }

  async getModelByMerk(merk: string) {
    const result = await this.njkbRepository
      .createQueryBuilder('njkb')
      .select('DISTINCT njkb.model', 'model')
      .where('njkb.merk = :merk', { merk })
      .getRawMany();

    const data = (result as { model: string }[]).map((r) => r.model);
    return ResponseHelper.success('Data berhasil diambil', data);
  }

  async getTipeByModel(model: string) {
    const result = await this.njkbRepository
      .createQueryBuilder('njkb')
      .select('DISTINCT njkb.tipe', 'tipe')
      .where('njkb.model = :model', { model })
      .getRawMany();

    const data = (result as { tipe: string }[]).map((r) => r.tipe);
    return ResponseHelper.success('Data berhasil diambil', data);
  }

  async getTahunByTipe(tipe: string) {
    const result = await this.njkbRepository
      .createQueryBuilder('njkb')
      .select('DISTINCT njkb.tahun', 'tahun')
      .where('njkb.tipe = :tipe', { tipe })
      .orderBy('tahun', 'ASC')
      .getRawMany();

    const data = (result as { tahun: number }[]).map((r) => Number(r.tahun));
    return ResponseHelper.success('Data berhasil diambil', data);
  }

  async cariNjkb(dto: CariNjkbDto) {
    const found = await this.njkbRepository.findOne({
      where: {
        jenis_kendaraan: dto.jenis_kendaraan,
        merk: dto.merk,
        model: dto.model,
        tipe: dto.tipe,
        tahun: dto.tahun,
      },
    });

    if (!found) {
      return ResponseHelper.error(
        'Data NJKB tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    return ResponseHelper.success('Data NJKB ditemukan', {
      jenis_kendaraan: found.jenis_kendaraan,
      merk: found.merk,
      model: found.model,
      tipe: found.tipe,
      tahun: found.tahun,
      njkb: Number(found.njkb),
    });
  }

  // Admin CRUD
  async create(dto: CreateKendaraanNjkbDto) {
    const newNjkb = this.njkbRepository.create(dto);
    const saved = await this.njkbRepository.save(newNjkb);
    return ResponseHelper.success('Data NJKB berhasil dibuat', {
      ...saved,
      njkb: Number(saved.njkb),
    });
  }

  async findAll() {
    const list = await this.njkbRepository.find();
    const formatted = list.map((item) => ({
      ...item,
      njkb: Number(item.njkb),
    }));
    return ResponseHelper.success('Data NJKB berhasil diambil', formatted);
  }

  async findOne(id: string) {
    const found = await this.njkbRepository.findOne({ where: { id } });
    if (!found) {
      return ResponseHelper.error(
        'Data NJKB tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }
    return ResponseHelper.success('Detail NJKB berhasil diambil', {
      ...found,
      njkb: Number(found.njkb),
    });
  }

  async update(id: string, dto: UpdateKendaraanNjkbDto) {
    const found = await this.njkbRepository.findOne({ where: { id } });
    if (!found) {
      return ResponseHelper.error(
        'Data NJKB tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }
    Object.assign(found, dto);
    const saved = await this.njkbRepository.save(found);
    return ResponseHelper.success('Data NJKB berhasil diperbarui', {
      ...saved,
      njkb: Number(saved.njkb),
    });
  }

  async remove(id: string) {
    const found = await this.njkbRepository.findOne({ where: { id } });
    if (!found) {
      return ResponseHelper.error(
        'Data NJKB tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }
    await this.njkbRepository.remove(found);
    return ResponseHelper.success('Data NJKB berhasil dihapus', null);
  }
}
