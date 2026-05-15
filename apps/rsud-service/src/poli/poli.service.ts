import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Poli } from './entities/poli.entity';
import { JadwalDokter } from '../antrean/entities/jadwal-dokter.entity';

const POLI_CACHE_KEY = 'rsud:poli:all';
const POLI_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class PoliService {
  constructor(
    @InjectRepository(Poli) private readonly poliRepo: Repository<Poli>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll() {
    const cached = await this.cache.get(POLI_CACHE_KEY);
    if (cached) return cached;

    const polis = await this.poliRepo.find({
      where: { is_active: true },
      relations: ['jadwal', 'jadwal.dokter'],
    });

    const result = polis.map((poli) => ({
      id: poli.id,
      nama: poli.nama,
      lantai: poli.lantai,
      dokter: this.groupDokter(poli.jadwal),
    }));

    await this.cache.set(POLI_CACHE_KEY, result, POLI_TTL_MS);
    return result;
  }

  private groupDokter(jadwal: JadwalDokter[]) {
    const map = new Map<string, any>();

    for (const j of jadwal) {
      if (!j.dokter?.is_active) continue;
      if (!map.has(j.dokter_id)) {
        map.set(j.dokter_id, {
          id: j.dokter.id,
          nama: j.dokter.nama,
          spesialis: j.dokter.spesialis,
          foto_url: j.dokter.foto_url,
          jam_mulai: j.jam_mulai,
          jam_selesai: j.jam_selesai,
          kuota_per_hari: j.kuota_per_hari,
          jadwal: [],
        });
      }
      map.get(j.dokter_id).jadwal.push(j.hari);
    }

    return Array.from(map.values());
  }

  async findOne(id: string) {
    const poli = await this.poliRepo.findOne({
      where: { id, is_active: true },
      relations: ['jadwal', 'jadwal.dokter'],
    });
    if (!poli) throw new NotFoundException('Poli tidak ditemukan');
    return poli;
  }
}
