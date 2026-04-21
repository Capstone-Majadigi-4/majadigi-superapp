import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poli } from './entities/poli.entity';

@Injectable()
export class PoliService {
  constructor(@InjectRepository(Poli) private readonly poliRepo: Repository<Poli>) {}

  findAll() {
    return this.poliRepo.find({
      where: { is_active: true },
      relations: ['jadwal', 'jadwal.dokter'],
    });
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
