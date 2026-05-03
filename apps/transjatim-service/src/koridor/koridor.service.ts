import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Koridor } from './entities/koridor.entity';

const CACHE_KEY = 'transjatim:koridor:all';
const CACHE_TTL = 600_000; 

@Injectable()
export class KoridorService {
  constructor(
    @InjectRepository(Koridor)
    private readonly koridorRepo: Repository<Koridor>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findAll(): Promise<Koridor[]> {
    const cached = await this.cache.get<Koridor[]>(CACHE_KEY);
    if (cached) return cached;

    const data = await this.koridorRepo.find({
      where: { is_active: true },
      order: { kode: 'ASC' },
    });

    await this.cache.set(CACHE_KEY, data, CACHE_TTL);
    return data;
  }

  async findOne(id: string): Promise<Koridor> {
    const koridor = await this.koridorRepo.findOne({ where: { id } });
    if (!koridor) throw new NotFoundException('Koridor tidak ditemukan');
    return koridor;
  }
}
