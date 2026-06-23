import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fasilitas } from '../fasilitas/entities/fasilitas.entity';
import { Acara } from '../acara/entities/acara.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Fasilitas)
    private readonly fasilitasRepo: Repository<Fasilitas>,
    @InjectRepository(Acara)
    private readonly acaraRepo: Repository<Acara>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedFasilitas();
    await this.seedAcara();
  }

  private async seedFasilitas() {
    const count = await this.fasilitasRepo.count();
    if (count > 0) return;

    await this.fasilitasRepo.save([
      {
        nama: 'Aula Utama',
        kapasitas: 500,
        harga_per_hari: 2500000,
        deskripsi: 'Aula serbaguna kapasitas besar untuk acara besar',
      },
      {
        nama: 'Ruang Serbaguna A',
        kapasitas: 150,
        harga_per_hari: 1000000,
        deskripsi: 'Ruang pertemuan ukuran sedang',
      },
      {
        nama: 'Ruang Serbaguna B',
        kapasitas: 100,
        harga_per_hari: 750000,
        deskripsi: 'Ruang pertemuan ukuran sedang',
      },
      {
        nama: 'Masjid Islamic Center',
        kapasitas: 1000,
        harga_per_hari: 0,
        deskripsi: 'Masjid utama untuk kegiatan ibadah dan keagamaan',
      },
      {
        nama: 'Ruang Kelas',
        kapasitas: 40,
        harga_per_hari: 300000,
        deskripsi: 'Ruang kelas untuk pelatihan dan kajian kecil',
      },
    ]);

    this.logger.log('Seeded: fasilitas');
  }

  private async seedAcara() {
    const count = await this.acaraRepo.count();
    if (count > 0) return;

    const today = new Date();
    const addDays = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return d.toISOString().split('T')[0];
    };

    await this.acaraRepo.save([
      {
        judul: 'Kajian Rutin Jumat Pagi',
        deskripsi: 'Kajian mingguan membahas fiqih sehari-hari',
        tanggal: addDays(3),
        waktu_mulai: '07:00:00',
        waktu_selesai: '09:00:00',
        lokasi: 'Masjid Islamic Center',
        kuota_maksimal: 200,
        status: 'aktif',
      },
      {
        judul: 'Seminar Ekonomi Syariah',
        deskripsi: 'Seminar peluang usaha halal dan keuangan syariah',
        tanggal: addDays(7),
        waktu_mulai: '08:00:00',
        waktu_selesai: '12:00:00',
        lokasi: 'Aula Utama',
        kuota_maksimal: 300,
        status: 'aktif',
      },
      {
        judul: 'Pelatihan Tahsin Al-Quran',
        deskripsi: 'Pelatihan memperbaiki bacaan Al-Quran untuk umum',
        tanggal: addDays(10),
        waktu_mulai: '09:00:00',
        waktu_selesai: '11:00:00',
        lokasi: 'Ruang Kelas',
        kuota_maksimal: 40,
        status: 'aktif',
      },
      {
        judul: 'Pengajian Akbar Akhir Bulan',
        deskripsi: 'Pengajian bersama dengan ustadz nasional',
        tanggal: addDays(14),
        waktu_mulai: '19:00:00',
        waktu_selesai: '21:30:00',
        lokasi: 'Aula Utama',
        kuota_maksimal: 500,
        status: 'aktif',
      },
    ]);

    this.logger.log('Seeded: acara');
  }
}
