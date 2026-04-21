import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Antrean } from './entities/antrean.entity';
import { Dokter } from './entities/dokter.entity';
import { CreateAntreanDto } from './dto/create-antrean.dto';
import { AntreanGateway } from './antrean.gateway';

@Injectable()
export class AntreanService {
  constructor(
    @InjectRepository(Antrean) private readonly antreanRepo: Repository<Antrean>,
    @InjectRepository(Dokter) private readonly dokterRepo: Repository<Dokter>,
    private readonly dataSource: DataSource,
    private readonly antreanGateway: AntreanGateway,
  ) {}

  async createAntrean(dto: CreateAntreanDto, userNik: string) {
    const dokter = await this.dokterRepo.findOne({
      where: { id: dto.dokter_id, is_active: true },
    });
    if (!dokter) throw new NotFoundException('Dokter tidak ditemukan');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Advisory lock per poli+tanggal — cegah race condition nomor antrean
      await queryRunner.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
        `antrean_${dto.poli_id}_${dto.tanggal}`,
      ]);

      const count = await queryRunner.manager.count(Antrean, {
        where: { poli_id: dto.poli_id, tanggal: dto.tanggal },
      });

      const nomor = count + 1;
      const nomorAntrean = `A-${String(nomor).padStart(3, '0')}`;

      const menitOffset = (nomor - 1) * 10;
      const jam = 8 + Math.floor(menitOffset / 60);
      const menit = String(menitOffset % 60).padStart(2, '0');
      const estimasiJam = `${String(jam).padStart(2, '0')}:${menit}:00`;

      const antrean = queryRunner.manager.create(Antrean, {
        user_nik: userNik,
        poli_id: dto.poli_id,
        dokter_id: dto.dokter_id,
        tanggal: dto.tanggal,
        nomor_antrean: nomorAntrean,
        estimasi_jam: estimasiJam,
        qr_checkin: uuidv4(),
        status: 'menunggu',
      });

      const saved = await queryRunner.manager.save(Antrean, antrean);
      await queryRunner.commitTransaction();

      // Load relations for response
      return this.antreanRepo.findOne({
        where: { id: saved.id },
        relations: ['poli', 'dokter'],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getStatus(id: string) {
    const antrean = await this.antreanRepo.findOne({
      where: { id },
      relations: ['poli', 'dokter'],
    });
    if (!antrean) throw new NotFoundException('Antrean tidak ditemukan');
    return antrean;
  }

  async panggilBerikutnya(poliId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // SELECT FOR UPDATE SKIP LOCKED — cegah double-call jika ada 2 admin
      const [antrean] = await queryRunner.query(
        `SELECT * FROM rsud.antrean
         WHERE poli_id = $1 AND status = 'menunggu'
         ORDER BY nomor_antrean ASC
         LIMIT 1
         FOR UPDATE SKIP LOCKED`,
        [poliId],
      );

      if (!antrean) throw new NotFoundException('Tidak ada antrean menunggu');

      await queryRunner.query(
        `UPDATE rsud.antrean
         SET status = 'dipanggil', dipanggil_at = NOW()
         WHERE id = $1`,
        [antrean.id],
      );

      await queryRunner.commitTransaction();

      const updated = await this.antreanRepo.findOne({
        where: { id: antrean.id },
        relations: ['poli', 'dokter'],
      });

      this.antreanGateway.broadcastDipanggil(poliId, updated!);
      return updated;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
