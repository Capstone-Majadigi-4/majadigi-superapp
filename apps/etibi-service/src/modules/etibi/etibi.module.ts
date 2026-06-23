import { Module }
from '@nestjs/common';

import { TypeOrmModule }
from '@nestjs/typeorm';

import { EtibiController }
from './etibi.controller';

import { PertanyaanSkrining }
from './entities/pertanyaan-skrining.entity';

import { HasilSkrining }
from './entities/hasil-skrining.entity';

import { PasienAktif }
from './entities/pasien-aktif.entity';

import { LogKonfirmasi }
from './entities/log-konfirmasi.entity';

import { ScreeningService }
from './services/screening.service';

import { AdherenceService }
from './services/adherence.service';

import { MonitoringService }
from './services/monitoring.service';

import { AdminGuard }
from '../../common/guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PertanyaanSkrining,
      HasilSkrining,
      PasienAktif,
      LogKonfirmasi,
    ]),
  ],

  controllers: [
    EtibiController,
  ],

  providers: [
    ScreeningService,
    AdherenceService,
    MonitoringService,
    AdminGuard,
  ],
})
export class EtibiModule {}