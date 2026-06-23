import { Module }
from '@nestjs/common';

import { TypeOrmModule }
from '@nestjs/typeorm';

import { TourismController }
from './tourism.controller';

import { WisataService }
from './services/wisata.service';

import { TiketService }
from './services/tiket.service';

import { RuteService }
from './services/rute.service';

import { AdminService }
from './services/admin.service';

import { AdminGuard }
from '../../common/guards/admin.guard';

import { Destinasi }
from './entities/destinasi.entity';

import { TiketPembelian }
from './entities/tiket-pembelian.entity';

import { FotoDestinasi }
from './entities/foto-destinasi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Destinasi,
      TiketPembelian,
      FotoDestinasi,
    ]),
  ],

  controllers: [
    TourismController,
  ],

  providers: [
    WisataService,
    TiketService,
    RuteService,
    AdminService,
    AdminGuard,
  ],
})
export class TourismModule {}