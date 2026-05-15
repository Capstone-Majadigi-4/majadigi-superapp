import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poli } from '../poli/entities/poli.entity';
import { Dokter } from '../antrean/entities/dokter.entity';
import { JadwalDokter } from '../antrean/entities/jadwal-dokter.entity';
import { Ruangan } from '../kamar/entities/ruangan.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Poli) private readonly poliRepo: Repository<Poli>,
    @InjectRepository(Dokter) private readonly dokterRepo: Repository<Dokter>,
    @InjectRepository(JadwalDokter)
    private readonly jadwalRepo: Repository<JadwalDokter>,
    @InjectRepository(Ruangan)
    private readonly ruanganRepo: Repository<Ruangan>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPoli();
    await this.seedDokter();
    await this.seedJadwal();
    await this.seedRuangan();
  }

  private async seedPoli() {
    const count = await this.poliRepo.count();
    if (count > 0) return;

    await this.poliRepo.save([
      { nama: 'Penyakit Dalam', lantai: 'Lantai 2' },
      { nama: 'Bedah', lantai: 'Lantai 3' },
      { nama: 'Anak', lantai: 'Lantai 1' },
      { nama: 'Jantung', lantai: 'Lantai 2' },
      { nama: 'Saraf', lantai: 'Lantai 3' },
    ]);

    this.logger.log('Seeded: poli');
  }

  private async seedDokter() {
    const count = await this.dokterRepo.count();
    if (count > 0) return;

    await this.dokterRepo.save([
      { nama: 'dr. Ahmad Fauzi Sp.PD', spesialis: 'Penyakit Dalam' },
      { nama: 'dr. Siti Rahayu Sp.B', spesialis: 'Bedah' },
      { nama: 'dr. Budi Santoso Sp.A', spesialis: 'Anak' },
      { nama: 'dr. Dewi Kusuma Sp.JP', spesialis: 'Jantung' },
      { nama: 'dr. Rizky Pratama Sp.S', spesialis: 'Saraf' },
    ]);

    this.logger.log('Seeded: dokter');
  }

  private async seedJadwal() {
    const count = await this.jadwalRepo.count();
    if (count > 0) return;

    const poli = await this.poliRepo.find();
    const dokter = await this.dokterRepo.find();

    const hariKerja = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];

    const pasangan = [
      { dokterNama: 'dr. Ahmad Fauzi Sp.PD', poliNama: 'Penyakit Dalam' },
      { dokterNama: 'dr. Siti Rahayu Sp.B', poliNama: 'Bedah' },
      { dokterNama: 'dr. Budi Santoso Sp.A', poliNama: 'Anak' },
      { dokterNama: 'dr. Dewi Kusuma Sp.JP', poliNama: 'Jantung' },
      { dokterNama: 'dr. Rizky Pratama Sp.S', poliNama: 'Saraf' },
    ];

    const jadwal: Partial<JadwalDokter>[] = [];

    for (const { dokterNama, poliNama } of pasangan) {
      const d = dokter.find((x) => x.nama === dokterNama);
      const p = poli.find((x) => x.nama === poliNama);
      if (!d || !p) continue;

      for (const hari of hariKerja) {
        jadwal.push({
          dokter_id: d.id,
          poli_id: p.id,
          hari,
          jam_mulai: '08:00:00',
          jam_selesai: '12:00:00',
          kuota_per_hari: 30,
        });
      }
    }

    await this.jadwalRepo.save(jadwal);
    this.logger.log('Seeded: jadwal_dokter');
  }

  private async seedRuangan() {
    const count = await this.ruanganRepo.count();
    if (count > 0) return;

    await this.ruanganRepo.save([
      { nama: 'R. PICU KRAKATAU', kelas: 'ICU', kapasitas: 20, terisi: 18 },
      { nama: 'R. TOBA BAYI', kelas: 'Perinatologi', kapasitas: 30, terisi: 12 },
      { nama: 'R. KRAKATAU', kelas: 'Kelas I', kapasitas: 50, terisi: 35 },
      { nama: 'R. RINJANI', kelas: 'Kelas II', kapasitas: 60, terisi: 40 },
      { nama: 'R. SEMERU', kelas: 'Kelas III', kapasitas: 80, terisi: 55 },
      { nama: 'R. BROMO VIP', kelas: 'VIP', kapasitas: 20, terisi: 8 },
      { nama: 'R. MERAPI VVIP', kelas: 'VVIP', kapasitas: 10, terisi: 3 },
      { nama: 'R. ICU UTAMA', kelas: 'ICU', kapasitas: 15, terisi: 10 },
      { nama: 'R. NICU', kelas: 'NICU', kapasitas: 12, terisi: 7 },
      { nama: 'R. AGUNG', kelas: 'Kelas II', kapasitas: 70, terisi: 45 },
      { nama: 'R. LAWU', kelas: 'Kelas III', kapasitas: 80, terisi: 60 },
      { nama: 'R. SINABUNG', kelas: 'Kelas I', kapasitas: 40, terisi: 20 },
    ]);

    this.logger.log('Seeded: ruangan');
  }
}
