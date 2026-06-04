import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { ProfilPencari }
from '../entities/profil-pencari.entity';

import { SaveProfilDto }
from '../dto/save-profil.dto';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class ProfilService {
  constructor(
    @InjectRepository(ProfilPencari)
    private readonly profilRepository:
      Repository<ProfilPencari>,
  ) {}

  async getProfil(
    userNik: string,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    const profil =
      await this.profilRepository.findOne(
        {
          where: {
            user_nik:
              userNik,
          },
        },
      );

    if (!profil) {
      return ResponseHelper.success(
        'Profil belum tersedia',
        null,
      );
    }

    return ResponseHelper.success(
      'Profil berhasil diambil',
      profil,
    );
  }

  async saveProfil(
    dto: SaveProfilDto,
    userNik: string,
  ) {
    if (!userNik) {
      return ResponseHelper.error(
        'User NIK tidak ditemukan',
        'UNAUTHORIZED',
        401,
      );
    }

    let profil =
      await this.profilRepository.findOne(
        {
          where: {
            user_nik:
              userNik,
          },
        },
      );

    if (!profil) {
      profil =
        this.profilRepository.create({
          user_nik:
            userNik,
        });
    }

    if (
      dto.ringkasan !==
      undefined
    ) {
      profil.ringkasan =
        dto.ringkasan;
    }

    if (
      dto.skill !== undefined
    ) {
      profil.skill =
        dto.skill;
    }

    if (
      dto.pendidikan !==
      undefined
    ) {
      profil.pendidikan =
        dto.pendidikan;
    }

    if (
      dto.pengalaman !==
      undefined
    ) {
      profil.pengalaman =
        dto.pengalaman;
    }

    if (
      dto.portfolio_url !==
      undefined
    ) {
      profil.portfolio_url =
        dto.portfolio_url;
    }

    await this.profilRepository.save(
      profil,
    );

    return ResponseHelper.success(
      'Profil berhasil disimpan',
      profil,
    );
  }
}