import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly tokenRepo: Repository<RefreshTokenEntity>,
  ) {}

  async create(data: {
    user_id: string;
    token: string;
    fcm_token: string;
    expires_at: Date;
  }) {
    const token_hash = await bcrypt.hash(data.token, 10);

    const entity = this.tokenRepo.create({
      user_id: data.user_id,
      token: token_hash,
      fcm_token: data.fcm_token,
      expires_at: data.expires_at,
      is_revoked: false,
    });

    await this.tokenRepo.save(entity);
  }

  async findValidByUserId(user_id: string, plainToken: string) {
    const tokens = await this.tokenRepo.find({
      where: {
        user_id,
        is_revoked: false,
      },
    });

    for (const t of tokens) {
      if (t.expires_at > new Date()) {
        const match = await bcrypt.compare(plainToken, t.token);
        if (match) return t;
      }
    }
    return null;
  }

  async revokeByUserId(user_id: string) {
    await this.tokenRepo.update(
      {
        user_id,
        is_revoked: false,
      },
      {
        is_revoked: true,
      },
    );
  }

  async revokeToken(id: string) {
    await this.tokenRepo.update({ id }, { is_revoked: true });
  }

  async updateFcmToken(user_id: string, fcm_token: string){
    await this.tokenRepo.update({ user_id, is_revoked: false }, { fcm_token });
  }
}
