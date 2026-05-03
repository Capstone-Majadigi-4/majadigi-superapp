import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Armada } from './entities/armada.entity';
import { UpdateLokasiDto } from './dto/update-lokasi.dto';

@Injectable()
export class ArmadaService {
  constructor(
    @InjectRepository(Armada)
    private readonly armadaRepo: Repository<Armada>,
  ) {}

  async findByKoridor(koridorId: string): Promise<Armada[]> {
    return this.armadaRepo.find({
      where: { koridor_id: koridorId, status: 'aktif' },
    });
  }

  async updateLokasi(id: string, dto: UpdateLokasiDto): Promise<Armada> {
    const armada = await this.armadaRepo.findOne({ where: { id } });
    if (!armada) throw new NotFoundException('Armada tidak ditemukan');

    armada.lat = dto.lat;
    armada.lng = dto.lng;

    return this.armadaRepo.save(armada);
  }
}
