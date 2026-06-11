import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { BapendaController } from './bapenda.controller';

import { KendaraanController } from './controllers/kendaraan.controller';

import { KendaraanService } from './services/kendaraan.service';

import { TagihanService } from './services/tagihan.service';

import { PembayaranService } from './services/pembayaran.service';

import { EtbpkbService } from './services/etbpkb.service';

import { AdminService } from './services/admin.service';

import { AdminGuard } from '../../common/guards/admin.guard';

import { Kendaraan } from './entities/kendaraan.entity';

import { TagihanPajak } from './entities/tagihan-pajak.entity';

import { TransaksiPembayaran } from './entities/transaksi-pembayaran.entity';

import { KendaraanNjkb } from './entities/kendaraan-njkb.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Kendaraan,
      TagihanPajak,
      TransaksiPembayaran,
      KendaraanNjkb,
    ]),
  ],

  controllers: [BapendaController, KendaraanController],

  providers: [
    KendaraanService,
    TagihanService,
    PembayaranService,
    EtbpkbService,
    AdminService,
    AdminGuard,
  ],
})
export class BapendaModule {}
