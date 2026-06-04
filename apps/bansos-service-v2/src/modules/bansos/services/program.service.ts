import { Injectable }
from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import { Repository }
from 'typeorm';

import { Program }
from '../entities/program.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository:
      Repository<Program>,
  ) {}

  async getProgramList() {
    const program =
      await this.programRepository.find({
        order: {
          nama: 'ASC',
        },
      });

    const result =
      program.map((item) => ({
        nama: item.nama,

        deskripsi:
          item.deskripsi,

        periode:
          item.periode,

        status:
          item.status,
      }));

    return ResponseHelper.success(
      'Data program bansos berhasil diambil',
      {
        program: result,
      },
    );
  }
}