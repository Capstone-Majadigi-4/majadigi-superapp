import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { generateSecret, verify } from 'otplib';
import * as QRCode from 'qrcode';
import { Tiket } from './entities/tiket.entity';
import { BeliTiketDto } from './dto/beli-tiket.dto';
import { ValidasiTiketDto } from './dto/validasi-tiket.dto';
import { KoridorService } from '../koridor/koridor.service';

function buildOtpUri(userNik: string, secret: string): string {
  return `otpauth://totp/TransJatim:${encodeURIComponent(userNik)}?secret=${secret}&issuer=TransJatim&algorithm=SHA1&digits=6&period=30`;
}

@Injectable()
export class TiketService {
  constructor(
    @InjectRepository(Tiket)
    private readonly tiketRepo: Repository<Tiket>,
    private readonly koridorService: KoridorService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async beli(
    dto: BeliTiketDto,
    userNik: string,
  ): Promise<{ tiket: Tiket; qr_image: string }> {
    const koridor = await this.koridorService.findOne(dto.koridor_id);
    if (!koridor.is_active) {
      throw new BadRequestException('Koridor tidak aktif');
    }

    const hargaSatuan = this.config.get<number>('HARGA_TIKET', 4000);
    const berlakuJam = this.config.get<number>('TIKET_BERLAKU_JAM', 3);
    const total = hargaSatuan * dto.jumlah;

    const secret = generateSecret();

    const validSampai = new Date();
    validSampai.setHours(validSampai.getHours() + berlakuJam);

    const tiket = this.tiketRepo.create({
      user_nik: userNik,
      koridor_id: dto.koridor_id,
      jumlah: dto.jumlah,
      total,
      qr_totp: secret,
      status: 'valid',
      valid_sampai: validSampai,
    });

    const saved = await this.tiketRepo.save(tiket);
    const result = await this.tiketRepo.findOne({
      where: { id: saved.id },
      relations: ['koridor'],
    });

    const qr_image = await QRCode.toDataURL(buildOtpUri(userNik, secret));

    await this.cache.del(`transjatim:tiket:user:${userNik}`);

    return { tiket: result, qr_image } as { tiket: Tiket; qr_image: string };
  }

  async findByUser(userNik: string): Promise<Tiket[]> {
    const key = `transjatim:tiket:user:${userNik}`;
    const cached = await this.cache.get<Tiket[]>(key);
    if (cached) return cached;

    const data = await this.tiketRepo.find({
      where: { user_nik: userNik },
      relations: ['koridor'],
      order: { created_at: 'DESC' },
    });

    await this.cache.set(key, data, 60_000);
    return data;
  }

  async findOne(
    id: string,
    userNik: string,
  ): Promise<{ tiket: Tiket; qr_image: string | null }> {
    const tiket = await this.tiketRepo.findOne({
      where: { id },
      relations: ['koridor'],
    });

    if (!tiket) throw new NotFoundException('Tiket tidak ditemukan');
    if (tiket.user_nik !== userNik)
      throw new ForbiddenException('Bukan tiket Anda');

    let qr_image: string | null = null;
    if (tiket.status === 'valid' && tiket.qr_totp) {
      qr_image = await QRCode.toDataURL(buildOtpUri(userNik, tiket.qr_totp));
    }

    return { tiket, qr_image };
  }

  async validasi(
    id: string,
    dto: ValidasiTiketDto,
  ): Promise<{ pesan: string }> {
    const tiket = await this.tiketRepo.findOne({ where: { id } });
    if (!tiket) throw new NotFoundException('Tiket tidak ditemukan');

    if (tiket.status === 'digunakan') {
      throw new BadRequestException('Tiket sudah digunakan');
    }

    if (tiket.status === 'expired' || new Date() > tiket.valid_sampai) {
      if (tiket.status !== 'expired') {
        tiket.status = 'expired';
        await this.tiketRepo.save(tiket);
      }
      throw new BadRequestException('Tiket sudah expired');
    }

    const isValid = verify({ token: dto.otp, secret: tiket.qr_totp });

    if (!isValid)
      throw new BadRequestException(
        'Kode OTP tidak valid atau sudah kadaluarsa',
      );

    tiket.status = 'digunakan';
    tiket.digunakan_at = new Date();
    await this.tiketRepo.save(tiket);

    await this.cache.del(`transjatim:tiket:user:${tiket.user_nik}`);

    return { pesan: 'Tiket berhasil divalidasi' };
  }
}
