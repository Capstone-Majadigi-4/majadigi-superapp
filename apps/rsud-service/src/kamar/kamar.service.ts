import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Ruangan } from './entities/ruangan.entity';

const KAMAR_SUMMARY_KEY = 'rsud:kamar:summary';
const KAMAR_TTL_MS = 30 * 1000;

@Injectable()
export class KamarService {
  constructor(
    @InjectRepository(Ruangan)
    private readonly ruanganRepo: Repository<Ruangan>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async getKetersediaan(search?: string) {
    const where: any = { is_active: true };
    if (search) where.nama = ILike(`%${search}%`);

    const ruangan = await this.ruanganRepo.find({ where, order: { nama: 'ASC' } });

    // Summary cards always reflect full dataset — use cache when no filter
    let totalKamar: number;
    let totalTersedia: number;

    const cached = await this.cache.get<{ total_kamar: number; tersedia: number }>(KAMAR_SUMMARY_KEY);
    if (cached) {
      totalKamar = cached.total_kamar;
      totalTersedia = cached.tersedia;
    } else {
      const all = await this.ruanganRepo.find({ where: { is_active: true } });
      totalKamar = all.reduce((s, r) => s + r.kapasitas, 0);
      totalTersedia = all.reduce((s, r) => s + Math.max(0, r.kapasitas - r.terisi), 0);
      await this.cache.set(KAMAR_SUMMARY_KEY, { total_kamar: totalKamar, tersedia: totalTersedia }, KAMAR_TTL_MS);
    }

    return {
      total_kamar: totalKamar,
      tersedia: totalTersedia,
      ruangan: ruangan.map((r) => ({
        id: r.id,
        nama: r.nama,
        kelas: r.kelas,
        kapasitas: r.kapasitas,
        terisi: r.terisi,
        tersedia: Math.max(0, r.kapasitas - r.terisi),
      })),
    };
  }

  async invalidateSummaryCache() {
    await this.cache.del(KAMAR_SUMMARY_KEY);
  }
}
