import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findByNik(nik: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { nik, is_active: true } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { id, is_active: true } });
  }

  async create(data: {
    nik: string;
    nama: string;
    password_hash: string;
    no_hp: string;
  }): Promise<UserEntity> {
    const existing = await this.userRepo.findOne({ where: { nik: data.nik } });
    if (existing) {
      throw new ConflictException('NIK sudah terdaftar');
    }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  maskNik(nik: string): string {
    if (nik.length !== 16) return nik;
    return nik.substring(0, 6) + '****' + nik.substring(12);
  }
}
