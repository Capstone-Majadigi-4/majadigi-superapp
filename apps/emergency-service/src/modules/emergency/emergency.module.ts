import { Module }
from '@nestjs/common';

import { TypeOrmModule }
from '@nestjs/typeorm';

import { EmergencyController }
from './emergency.controller';

import { PanicService }
from './services/panic.service';

import { LaporanService }
from './services/laporan.service';

import { DispatchService }
from './services/dispatch.service';

import { AdminService }
from './services/admin.service';

import { Instansi }
from './entities/instansi.entity';

import { LaporanPanic }
from './entities/laporan-panic.entity';

import { AdminGuard }
from '../../common/guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Instansi,
      LaporanPanic,
    ]),
  ],

  controllers: [
    EmergencyController,
  ],

  providers: [
    PanicService,
    LaporanService,
    DispatchService,
    AdminService,
    AdminGuard,
  ],
})
export class EmergencyModule {}