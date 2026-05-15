import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Acara } from './entities/acara.entity';
import { DataSource, Repository } from 'typeorm';
import { PendaftaranAcara } from './entities/pendaftaran.entity';
import { v4 as uuidv4 } from 'uuid';
import type { Cache } from 'cache-manager';
import { CreateAcaraDto, UpdateAcaraDto } from './dto/create-acara.dto';
import * as path from 'node:path';
import { MinioService } from '../common/minio/minio.service';
import 'multer';

const ACARA_CACHE_KEY = 'islamic:acara:all';
const ACARA_TTL_MS = 60 * 1000;

@Injectable()
export class AcaraService {
  private readonly logger = new Logger(AcaraService.name);

  constructor(
    @InjectRepository(Acara)
    private readonly acaraRepo: Repository<Acara>,
    @InjectRepository(PendaftaranAcara)
    private readonly pendaftaranRepo: Repository<PendaftaranAcara>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly minio: MinioService,
  ) {}

  async findAll(tanggal?: string, status?: string) {
    const cacheKey = `${ACARA_CACHE_KEY}:${tanggal ?? ''}:${status ?? ''}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const qb = this.acaraRepo
      .createQueryBuilder('a')
      .where('a.status != :batal', { batal: 'dibatalkan' });

    if (tanggal) qb.andWhere('a.tanggal = :tanggal', { tanggal });
    if (status) qb.andWhere('a.status = :status', { status });

    qb.orderBy('a.tanggal', 'ASC').addOrderBy('a.waktu_mulai', 'ASC');

    const result = await qb.getMany();
    await this.cache.set(cacheKey, result, ACARA_TTL_MS);
    return result;
  }

  async findOne(id: string) {
    const acara = await this.acaraRepo.findOne({ where: { id } });
    if (!acara) throw new NotFoundException('Acara tidak ditemukan');
    return {
      ...acara,
      sisa_kuota: acara.kuota_maksimal - acara.kuota_terisi,
    };
  }

  async daftar(acaraId: string, userNik: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
        `acara_daftar_${acaraId}`,
      ]);

      const acara = await queryRunner.manager.findOne(Acara, {
        where: { id: acaraId },
      });
      if (!acara) throw new NotFoundException('Acara tidak ditemukan');
      if (acara.status !== 'aktif')
        throw new ConflictException('Acara tidak aktif');
      if (acara.kuota_terisi >= acara.kuota_maksimal)
        throw new ConflictException('Kuota acara sudah penuh');

      const sudahDaftar = await queryRunner.manager.findOne(PendaftaranAcara, {
        where: { acara_id: acaraId, user_nik: userNik },
      });
      if (sudahDaftar)
        throw new ConflictException('Anda sudah terdaftar di acara ini');

      await queryRunner.query(
        `UPDATE islamic.acara SET kuota_terisi = kuota_terisi + 1 WHERE id = $1`,
        [acaraId],
      );

      const pendaftaran = queryRunner.manager.create(PendaftaranAcara, {
        acara_id: acaraId,
        user_nik: userNik,
        qr_payload: uuidv4(),
        status: 'valid',
      });

      const saved = await queryRunner.manager.save(
        PendaftaranAcara,
        pendaftaran,
      );
      await queryRunner.commitTransaction();

      await this.invalidateCache();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async riwayatSaya(userNik: string) {
    return this.pendaftaranRepo.find({
      where: { user_nik: userNik },
      relations: ['acara'],
      order: { daftar_at: 'DESC' },
    });
  }

  // ADMIN

  async create(
    dto: CreateAcaraDto,
    adminNik: string,
    file: Express.Multer.File,
  ) {
    let poster_url = dto.poster_url;

    if (file) {
      this.logger.log(`Uploading poster: ${file.originalname} (${file.mimetype})`);
      try {
        const ext = path.extname(file.originalname);
        const filename = `acara/poster-${uuidv4()}${ext}`;
        poster_url = await this.minio.uploadFile(filename, file.buffer, file.mimetype);
        this.logger.log(`Poster uploaded: ${poster_url}`);
      } catch (err) {
        const e = err as Error;
        this.logger.error(`MinIO upload gagal: ${e.message}`, e.stack);
        throw err;
      }
    }

    try {
      const acara = this.acaraRepo.create({
        ...dto,
        poster_url,
        dibuat_oleh: adminNik,
        status: 'aktif',
      });
      const saved = await this.acaraRepo.save(acara);
      this.logger.log(`Acara dibuat: ${saved.id}`);
      await this.invalidateCache();
      return saved;
    } catch (err) {
      const e = err as Error;
      this.logger.error(`Gagal simpan acara: ${e.message}`, e.stack);
      throw err;
    }
  }

  async update(id: string, dto: UpdateAcaraDto, file?: Express.Multer.File) {
    const acara = await this.acaraRepo.findOne({ where: { id } });
    if (!acara) throw new NotFoundException('Acara tidak ditemukan');

    if (file) {
      if (acara.poster_url) {
        const oldFilename = acara.poster_url.split(`/majadigi/`)[1];
        if (oldFilename)
          await this.minio.deleteFile(oldFilename).catch((err: Error) =>
            this.logger.warn(`Gagal hapus poster lama: ${err.message}`),
          );
      }
      this.logger.log(`Uploading poster baru: ${file.originalname}`);
      try {
        const ext = path.extname(file.originalname);
        const filename = `acara/poster-${uuidv4()}${ext}`;
        dto.poster_url = await this.minio.uploadFile(filename, file.buffer, file.mimetype);
        this.logger.log(`Poster diupdate: ${dto.poster_url}`);
      } catch (err) {
        const e = err as Error;
        this.logger.error(`MinIO upload gagal: ${e.message}`, e.stack);
        throw err;
      }
    }

    Object.assign(acara, dto);
    const saved = await this.acaraRepo.save(acara);
    await this.invalidateCache();
    return saved;
  }

  async remove(id: string) {
    const acara = await this.acaraRepo.findOne({ where: { id } });
    if (!acara) throw new NotFoundException('Acara tidak ditemukan');
    acara.status = 'dibatalkan';
    await this.acaraRepo.save(acara);
    await this.invalidateCache();
  }

  //HELPER

  private async invalidateCache() {
    const keys = await (this.cache as any).store?.keys?.(`${ACARA_CACHE_KEY}*`);
    if (keys?.length) {
      await Promise.all(keys.map((k: string) => this.cache.del(k)));
    }
  }
}
