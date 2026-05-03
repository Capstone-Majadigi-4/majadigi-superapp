import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Halte } from './entities/halte.entity';
import { FindTerdekatDto } from './dto/find-terdekat.dto';

@Injectable()
export class HalteService {
  constructor(
    @InjectRepository(Halte)
    private readonly halteRepo: Repository<Halte>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findByKoridor(koridorId: string): Promise<Halte[]> {
    const key = `transjatim:halte:koridor:${koridorId}`;
    const cached = await this.cache.get<Halte[]>(key);
    if (cached) return cached;

    const data = await this.halteRepo.find({
      where: { koridor_id: koridorId },
      order: { urutan: 'ASC' },
    });

    await this.cache.set(key, data, 600_000);
    return data;
  }

  async findTerdekat(dto: FindTerdekatDto): Promise<any[]> {
    const { lat, lng, radius = 2000 } = dto;

    return this.dataSource.query(
      `
      SELECT
        id, koridor_id, nama, urutan,
        lat::float, lng::float,
        ROUND(
          6371000 * acos(
            LEAST(1.0, cos(radians($1)) * cos(radians(lat::float))
            * cos(radians(lng::float) - radians($2))
            + sin(radians($1)) * sin(radians(lat::float)))
          )
        ) AS jarak_meter
      FROM transjatim.halte
      WHERE lat IS NOT NULL AND lng IS NOT NULL
      HAVING ROUND(
        6371000 * acos(
          LEAST(1.0, cos(radians($1)) * cos(radians(lat::float))
          * cos(radians(lng::float) - radians($2))
          + sin(radians($1)) * sin(radians(lat::float)))
        )
      ) <= $3
      ORDER BY jarak_meter ASC
      LIMIT 5
      `,
      [lat, lng, radius],
    );
  }
}
