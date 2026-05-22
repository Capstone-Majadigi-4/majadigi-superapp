import { Injectable } from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { PasienAktif }
from '../entities/pasien-aktif.entity';

import { LogKonfirmasi }
from '../entities/log-konfirmasi.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

import { KonfirmasiObatDto }
from '../dto/konfirmasi-obat.dto';

@Injectable()
export class AdherenceService {
  constructor(
    @InjectRepository(
      PasienAktif,
    )
    private readonly pasienRepository:
      Repository<PasienAktif>,

    @InjectRepository(
      LogKonfirmasi,
    )
    private readonly logRepository:
      Repository<LogKonfirmasi>,
  ) {}

  async konfirmasiObat(
    userNik: string,
    dto: KonfirmasiObatDto,
  ) {
    const pasien =
      await this.pasienRepository.findOne(
        {
          where: {
            user_nik: userNik,
          },
        },
      );

    if (!pasien) {
      return ResponseHelper.error(
        'Anda belum terdaftar sebagai pasien pengobatan aktif',
        'PATIENT_NOT_ACTIVE',
        404,
      );
    }

    const tanggalKonfirmasi =
      new Date(
        dto.timestamp_minum,
      )
        .toISOString()
        .split('T')[0];

    const existingLog =
      await this.logRepository.findOne(
        {
          where: {
            pasien: {
              id: pasien.id,
            },

            tanggal:
              tanggalKonfirmasi as any,
          },

          relations: [
            'pasien',
          ],
        },
      );

    const startDate =
      new Date(
        pasien.tanggal_mulai,
      );

    const currentDate =
      new Date(
        dto.timestamp_minum,
      );

    const diffTime =
      currentDate.getTime() -
      startDate.getTime();

    const hariKe =
      Math.floor(
        diffTime /
          (1000 * 60 * 60 * 24),
      ) + 1;

    const totalKonfirmasi =
      await this.logRepository.count(
        {
          where: {
            pasien: {
              id: pasien.id,
            },

            dikonfirmasi: true,
          },

          relations: [
            'pasien',
          ],
        },
      );

    if (existingLog) {
      return ResponseHelper.success(
        'Obat hari ini sudah dikonfirmasi',
        {
          hari_ke: hariKe,
          streak:
            totalKonfirmasi,
          tanggal:
            existingLog.tanggal,
          dikonfirmasi:
            existingLog.dikonfirmasi,
        },
      );
    }

    const log =
      this.logRepository.create({
        pasien,
        tanggal:
          tanggalKonfirmasi as any,
        dikonfirmasi: true,
        timestamp_konfirmasi:
          new Date(
            dto.timestamp_minum,
          ),
      });

    await this.logRepository.save(
      log,
    );

    return ResponseHelper.success(
      'Konfirmasi minum obat berhasil',
      {
        hari_ke: hariKe,
        streak:
          totalKonfirmasi + 1,
        tanggal:
          tanggalKonfirmasi,
        dikonfirmasi: true,
      },
    );
  }

  async getKalenderKepatuhan(
    userNik: string,
  ) {
    const pasien =
      await this.pasienRepository.findOne(
        {
          where: {
            user_nik: userNik,
          },
        },
      );

    if (!pasien) {
      return ResponseHelper.error(
        'Pasien tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    const logs =
      await this.logRepository.find(
        {
          where: {
            pasien: {
              id: pasien.id,
            },
          },

          relations: [
            'pasien',
          ],

          order: {
            tanggal: 'ASC',
          },
        },
      );

    const result =
      logs.map((item) => ({
        tanggal:
          item.tanggal,
        dikonfirmasi:
          item.dikonfirmasi,
      }));

    return ResponseHelper.success(
      'Kalender kepatuhan berhasil diambil',
      result,
    );
  }

  async getStatusPengobatan(
    userNik: string,
  ) {
    const pasien =
      await this.pasienRepository.findOne(
        {
          where: {
            user_nik: userNik,
          },
        },
      );

    if (!pasien) {
      return ResponseHelper.error(
        'Pasien tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    const startDate =
      new Date(
        pasien.tanggal_mulai,
      );

    const currentDate =
      new Date();

    const diffTime =
      currentDate.getTime() -
      startDate.getTime();

    const hariKe =
      Math.floor(
        diffTime /
          (1000 * 60 * 60 * 24),
      ) + 1;

    return ResponseHelper.success(
      'Status pengobatan berhasil diambil',
      {
        nama: pasien.nama,
        fase_pengobatan:
          pasien.fase_pengobatan,
        hari_ke: hariKe,
        jam_minum_obat:
          pasien.jam_minum_obat,
        status: pasien.status,
      },
    );
  }
}