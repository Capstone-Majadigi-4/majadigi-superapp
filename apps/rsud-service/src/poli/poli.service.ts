import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poli } from './entities/poli.entity';
import { JadwalDokter } from '../antrean/entities/jadwal-dokter.entity';

@Injectable()
export class PoliService {
  constructor(
    @InjectRepository(Poli) private readonly poliRepo: Repository<Poli>,
  ) {}

  findAll() {
    return this.poliRepo
      .find({
        where: { is_active: true },
        relations: ['jadwal', 'jadwal.dokter'],
      })
      .then((polis) =>
        polis.map((poli) => ({
          id: poli.id,
          nama: poli.nama,
          lantai: poli.lantai,
          dokter: this.groupDokter(poli.jadwal),
        })),
      );
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
