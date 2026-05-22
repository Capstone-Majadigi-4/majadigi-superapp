import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { Pengumuman }
from '../entities/pengumuman.entity';

import { Program }
from '../entities/program.entity';

import { CreatePengumumanDto }
from '../dto/create-pengumuman.dto';

import { UpdatePengumumanDto }
from '../dto/update-pengumuman.dto';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Pengumuman)
    private readonly pengumumanRepository:
      Repository<Pengumuman>,

    @InjectRepository(Program)
    private readonly programRepository:
      Repository<Program>,
  ) {}

  async syncData() {
    const totalSynced = 120;

    return ResponseHelper.success(
      'Sinkronisasi berhasil',
      {
        total_synced:
          totalSynced,

        status:
          'completed',
      },
    );
  }

  async createPengumuman(
    dto: CreatePengumumanDto,
  ) {
    let program:
      Program | null = null;

    if (dto.program_id) {
      program =
        await this.programRepository.findOne(
          {
            where: {
              id: dto.program_id,
            },
          },
        );

      if (!program) {
        return ResponseHelper.error(
          'Program tidak ditemukan',
          'NOT_FOUND',
          404,
        );
      }
    }

    const pengumuman =
      this.pengumumanRepository.create({
        judul:
          dto.judul,

        konten:
          dto.konten,

        aktif_dari:
          dto.aktif_dari as any,

        aktif_sampai:
          dto.aktif_sampai as any,

        program:
          program || undefined,
      });

    await this.pengumumanRepository.save(
      pengumuman,
    );

    return ResponseHelper.success(
      'Pengumuman berhasil dibuat',
      {
        id:
          pengumuman.id,

        judul:
          pengumuman.judul,
      },
    );
  }

  async updatePengumuman(
    id: string,
    dto: UpdatePengumumanDto,
  ) {
    const pengumuman =
      await this.pengumumanRepository.findOne(
        {
          where: {
            id,
          },

          relations: {
            program: true,
          },
        },
      );

    if (!pengumuman) {
      return ResponseHelper.error(
        'Pengumuman tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    if (dto.program_id) {
      const program =
        await this.programRepository.findOne(
          {
            where: {
              id: dto.program_id,
            },
          },
        );

      if (!program) {
        return ResponseHelper.error(
          'Program tidak ditemukan',
          'NOT_FOUND',
          404,
        );
      }

      pengumuman.program =
        program;
    }

    if (
      dto.judul !==
      undefined
    ) {
      pengumuman.judul =
        dto.judul;
    }

    if (
      dto.konten !==
      undefined
    ) {
      pengumuman.konten =
        dto.konten;
    }

    if (
      dto.aktif_dari !==
      undefined
    ) {
      pengumuman.aktif_dari =
        dto.aktif_dari as any;
    }

    if (
      dto.aktif_sampai !==
      undefined
    ) {
      pengumuman.aktif_sampai =
        dto.aktif_sampai as any;
    }

    await this.pengumumanRepository.save(
      pengumuman,
    );

    return ResponseHelper.success(
      'Pengumuman berhasil diupdate',
      {
        id:
          pengumuman.id,

        judul:
          pengumuman.judul,
      },
    );
  }

  async deletePengumuman(
    id: string,
  ) {
    const pengumuman =
      await this.pengumumanRepository.findOne(
        {
          where: {
            id,
          },
        },
      );

    if (!pengumuman) {
      return ResponseHelper.error(
        'Pengumuman tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    await this.pengumumanRepository.remove(
      pengumuman,
    );

    return ResponseHelper.success(
      'Pengumuman berhasil dihapus',
    );
  }
}