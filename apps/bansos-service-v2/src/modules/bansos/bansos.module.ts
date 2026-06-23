import { Module }
from '@nestjs/common';

import { TypeOrmModule }
from '@nestjs/typeorm';

import { BansosController }
from './bansos.controller';

import { Penerima }
from './entities/penerima.entity';

import { PenerimaService }
from './services/penerima.service';

import { ProgramService }
from './services/program.service';

import { PengumumanService }
from './services/pengumuman.service';

import { AdminService }
from './services/admin.service';

import { Program }
from './entities/program.entity';

import { Pengumuman }
from './entities/pengumuman.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Penerima, Program, Pengumuman
    ]),
  ],

  controllers: [
    BansosController,
  ],

  providers: [
    PenerimaService,
    ProgramService,
    PengumumanService,
    AdminService,
  ],
})
export class BansosModule {}