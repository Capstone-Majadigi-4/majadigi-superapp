import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Koridor } from '../koridor/entities/koridor.entity';
import { Halte } from '../halte/entities/halte.entity';
import { Armada } from '../armada/entities/armada.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Koridor)
    private readonly koridorRepo: Repository<Koridor>,
    @InjectRepository(Halte)
    private readonly halteRepo: Repository<Halte>,
    @InjectRepository(Armada)
    private readonly armadaRepo: Repository<Armada>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedKoridor();
  }

  private async seedKoridor() {
    const count = await this.koridorRepo.count();
    if (count > 0) return; // skip kalau sudah ada data

    this.logger.log('Seeding koridor & halte...');

    const koridor1 = await this.koridorRepo.save(
      this.koridorRepo.create({
        kode: 'TJ-01',
        nama: 'Koridor 1 - Purabaya - Darmo',
        asal: 'Terminal Purabaya',
        tujuan: 'Jl. Darmo',
        is_active: true,
      }),
    );

    const koridor2 = await this.koridorRepo.save(
      this.koridorRepo.create({
        kode: 'TJ-02',
        nama: 'Koridor 2 - Rajawali - Wonokromo',
        asal: 'Rajawali',
        tujuan: 'Wonokromo',
        is_active: true,
      }),
    );

    // Halte Koridor 1
    await this.halteRepo.save(
      [
        {
          koridor_id: koridor1.id,
          nama: 'Terminal Purabaya',
          urutan: 1,
          lat: -7.3572,
          lng: 112.7185,
        },
        {
          koridor_id: koridor1.id,
          nama: 'Margorejo',
          urutan: 2,
          lat: -7.3241,
          lng: 112.7323,
        },
        {
          koridor_id: koridor1.id,
          nama: 'Jemursari',
          urutan: 3,
          lat: -7.319,
          lng: 112.7401,
        },
        {
          koridor_id: koridor1.id,
          nama: 'Ngagel',
          urutan: 4,
          lat: -7.2978,
          lng: 112.7419,
        },
        {
          koridor_id: koridor1.id,
          nama: 'Darmo',
          urutan: 5,
          lat: -7.2834,
          lng: 112.7341,
        },
      ].map((h) => this.halteRepo.create(h)),
    );

    // Halte Koridor 2
    await this.halteRepo.save(
      [
        {
          koridor_id: koridor2.id,
          nama: 'Rajawali',
          urutan: 1,
          lat: -7.2274,
          lng: 112.7312,
        },
        {
          koridor_id: koridor2.id,
          nama: 'Pasar Turi',
          urutan: 2,
          lat: -7.2378,
          lng: 112.7267,
        },
        {
          koridor_id: koridor2.id,
          nama: 'Tunjungan',
          urutan: 3,
          lat: -7.2575,
          lng: 112.7378,
        },
        {
          koridor_id: koridor2.id,
          nama: 'Wonokromo',
          urutan: 4,
          lat: -7.3012,
          lng: 112.7352,
        },
      ].map((h) => this.halteRepo.create(h)),
    );

    // Armada sample
    await this.armadaRepo.save([
      this.armadaRepo.create({
        koridor_id: koridor1.id,
        kode_bus: 'TJ-01-A',
        kapasitas: 60,
        status: 'aktif',
      }),
      this.armadaRepo.create({
        koridor_id: koridor1.id,
        kode_bus: 'TJ-01-B',
        kapasitas: 60,
        status: 'aktif',
      }),
      this.armadaRepo.create({
        koridor_id: koridor2.id,
        kode_bus: 'TJ-02-A',
        kapasitas: 60,
        status: 'aktif',
      }),
    ]);

    this.logger.log('Seeder selesai.');
  }
}
