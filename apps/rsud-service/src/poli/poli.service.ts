import { Injectable, NotFoundException } from '@nestjs/common';
import { Poli } from './entities/poli.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoliService {
    constructor(
        @InjectRepository(Poli) private poliRepository: Repository<Poli>,
    ) {}

    findAll() {
        return this.poliRepository.find({ where: { is_active: true } });
    }

    async findOne(id: number) {
        const poli = await this.poliRepository.findOne({where: {id, is_active: true}});
        if(!poli) throw new NotFoundException('Poli tidak ditemukan')
        
        return poli
    }


}
