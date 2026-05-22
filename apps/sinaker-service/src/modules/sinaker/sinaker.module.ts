import { Module }
from '@nestjs/common';

import { TypeOrmModule }
from '@nestjs/typeorm';

import { SinakerController }
from './sinaker.controller';

import { LowonganService }
from './services/lowongan.service';

import { LamaranService }
from './services/lamaran.service';

import { ProfilService }
from './services/profil.service';

import { AdminService }
from './services/admin.service';

import { Lowongan }
from './entities/lowongan.entity';

import { Lamaran }
from './entities/lamaran.entity';

import { ProfilPencari }
from './entities/profil-pencari.entity';

import { Perusahaan }
from './entities/perusahaan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lowongan,
      Lamaran,
      ProfilPencari,
      Perusahaan,
    ]),
  ],

  controllers: [
    SinakerController,
  ],

  providers: [
    LowonganService,
    LamaranService,
    ProfilService,
    AdminService,
  ],
})
export class SinakerModule {}