import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KendaraanNjkb } from '../modules/bapenda/entities/kendaraan-njkb.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(KendaraanNjkb)
    private readonly njkbRepository: Repository<KendaraanNjkb>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedNjkb();
  }

  private async seedNjkb() {
    const count = await this.njkbRepository.count();
    if (count > 0) {
      this.logger.log('NJKB table already has data. Skipping seeder.');
      return;
    }

    this.logger.log('Seeding NJKB data...');

    const baseTemplates = [
      // Mobil - Toyota
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Fortuner',
        tipe: 'VRZ',
        baseNjkb: 450000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Fortuner',
        tipe: 'GR Sport',
        baseNjkb: 480000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Avanza',
        tipe: '1.3 G',
        baseNjkb: 180000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Avanza',
        tipe: '1.5 G',
        baseNjkb: 195000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Avanza',
        tipe: 'Veloz',
        baseNjkb: 220000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Innova',
        tipe: '2.4 G',
        baseNjkb: 310000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Innova',
        tipe: '2.4 V',
        baseNjkb: 350000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Innova',
        tipe: 'Zenix G',
        baseNjkb: 390000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Toyota',
        model: 'Innova',
        tipe: 'Zenix V',
        baseNjkb: 420000000,
      },

      // Mobil - Honda
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'BR-V',
        tipe: 'E',
        baseNjkb: 210000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'BR-V',
        tipe: 'Prestige',
        baseNjkb: 235000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'HR-V',
        tipe: 'E',
        baseNjkb: 280000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'HR-V',
        tipe: 'SE',
        baseNjkb: 310000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'HR-V',
        tipe: 'RS Turbo',
        baseNjkb: 390000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'Brio',
        tipe: 'Satya S',
        baseNjkb: 110000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'Brio',
        tipe: 'Satya E',
        baseNjkb: 120000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Honda',
        model: 'Brio',
        tipe: 'RS',
        baseNjkb: 145000000,
      },

      // Mobil - Mitsubishi
      {
        jenis: 'Mobil',
        merk: 'Mitsubishi',
        model: 'Pajero Sport',
        tipe: 'Exceed',
        baseNjkb: 460000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Mitsubishi',
        model: 'Pajero Sport',
        tipe: 'Dakar',
        baseNjkb: 510000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Mitsubishi',
        model: 'Pajero Sport',
        tipe: 'Dakar Ultimate',
        baseNjkb: 550000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Mitsubishi',
        model: 'Xpander',
        tipe: 'Exceed',
        baseNjkb: 200000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Mitsubishi',
        model: 'Xpander',
        tipe: 'Sport',
        baseNjkb: 220000000,
      },
      {
        jenis: 'Mobil',
        merk: 'Mitsubishi',
        model: 'Xpander',
        tipe: 'Ultimate',
        baseNjkb: 240000000,
      },

      // Motor - Honda
      {
        jenis: 'Motor',
        merk: 'Honda',
        model: 'Beat',
        tipe: 'Sporty CBS',
        baseNjkb: 12500000,
      },
      {
        jenis: 'Motor',
        merk: 'Honda',
        model: 'Beat',
        tipe: 'Deluxe',
        baseNjkb: 13500000,
      },
      {
        jenis: 'Motor',
        merk: 'Honda',
        model: 'Vario 160',
        tipe: 'CBS',
        baseNjkb: 19500000,
      },
      {
        jenis: 'Motor',
        merk: 'Honda',
        model: 'Vario 160',
        tipe: 'ABS',
        baseNjkb: 21500000,
      },
      {
        jenis: 'Motor',
        merk: 'Honda',
        model: 'PCX 160',
        tipe: 'CBS',
        baseNjkb: 24500000,
      },
      {
        jenis: 'Motor',
        merk: 'Honda',
        model: 'PCX 160',
        tipe: 'ABS',
        baseNjkb: 27500000,
      },

      // Motor - Yamaha
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'NMAX',
        tipe: 'Standard',
        baseNjkb: 23500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'NMAX',
        tipe: 'Connected',
        baseNjkb: 25500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'NMAX',
        tipe: 'Connected ABS',
        baseNjkb: 28500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'Aerox',
        tipe: 'Standard',
        baseNjkb: 21500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'Aerox',
        tipe: 'Cyber City',
        baseNjkb: 22500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'Aerox',
        tipe: 'Connected ABS',
        baseNjkb: 25500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'Mio',
        tipe: 'M3 125',
        baseNjkb: 11500000,
      },
      {
        jenis: 'Motor',
        merk: 'Yamaha',
        model: 'Mio',
        tipe: 'Gear 125',
        baseNjkb: 12500000,
      },

      // Motor - Suzuki
      {
        jenis: 'Motor',
        merk: 'Suzuki',
        model: 'Nex II',
        tipe: 'Standard',
        baseNjkb: 11000000,
      },
      {
        jenis: 'Motor',
        merk: 'Suzuki',
        model: 'Nex II',
        tipe: 'Elegant',
        baseNjkb: 11500000,
      },
      {
        jenis: 'Motor',
        merk: 'Suzuki',
        model: 'Nex II',
        tipe: 'Fancy Edition',
        baseNjkb: 12000000,
      },
    ];

    const years = [2022, 2023, 2024, 2025];
    const entitiesToSave: Partial<KendaraanNjkb>[] = [];

    for (const template of baseTemplates) {
      for (const year of years) {
        // Apply slight price reduction for older years:
        // 2025: 100%, 2024: 96%, 2023: 92%, 2022: 88%
        const multiplier = 1 - (2025 - year) * 0.04;
        const finalNjkb = Math.round(template.baseNjkb * multiplier);

        entitiesToSave.push({
          jenis_kendaraan: template.jenis,
          merk: template.merk,
          model: template.model,
          tipe: template.tipe,
          tahun: year,
          njkb: finalNjkb,
        });
      }
    }

    await this.njkbRepository.save(entitiesToSave);
    this.logger.log(
      `Successfully seeded ${entitiesToSave.length} NJKB entries.`,
    );
  }
}
