import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { Fasilitas } from './entities/fasilitas.entity';
import { BookingFasilitas } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateFasilitasDto } from './dto/create-fasilitas.dto';
import { TolakBookingDto } from './dto/tolak-booking.dto';

const FASILITAS_CACHE_KEY = 'islamic:fasilitas:all';
const FASILITAS_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class FasilitasService {
  constructor(
    @InjectRepository(Fasilitas)
    private readonly fasilitasRepo: Repository<Fasilitas>,
    @InjectRepository(BookingFasilitas)
    private readonly bookingRepo: Repository<BookingFasilitas>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll() {
    const cached = await this.cache.get(FASILITAS_CACHE_KEY);
    if (cached) return cached;

    const result = await this.fasilitasRepo.find({
      where: { is_active: true },
      order: { nama: 'ASC' },
    });

    await this.cache.set(FASILITAS_CACHE_KEY, result, FASILITAS_TTL_MS);
    return result;
  }

  async findOne(id: string) {
    const fasilitas = await this.fasilitasRepo.findOne({
      where: { id, is_active: true },
    });
    if (!fasilitas) throw new NotFoundException('Fasilitas tidak ditemukan');

    // Tanggal yang sudah terbooked (disetujui)
    const bookings = await this.bookingRepo.find({
      where: { fasilitas_id: id, status: 'disetujui' },
      select: ['tanggal_mulai', 'tanggal_selesai', 'nama_acara'],
      order: { tanggal_mulai: 'ASC' },
    });

    return { ...fasilitas, tanggal_terbooked: bookings };
  }

  async booking(fasilitasId: string, userNik: string, dto: CreateBookingDto) {
    const fasilitas = await this.fasilitasRepo.findOne({
      where: { id: fasilitasId, is_active: true },
    });
    if (!fasilitas) throw new NotFoundException('Fasilitas tidak ditemukan');

    // Cek overlap tanggal dengan booking yang sudah disetujui
    const overlap = await this.dataSource.query(
      `SELECT id FROM islamic.booking_fasilitas
       WHERE fasilitas_id = $1
         AND status = 'disetujui'
         AND tanggal_mulai <= $3
         AND tanggal_selesai >= $2`,
      [fasilitasId, dto.tanggal_mulai, dto.tanggal_selesai],
    );

    if (overlap.length > 0)
      throw new ConflictException(
        'Fasilitas sudah terbooked pada tanggal tersebut',
      );

    const selisihHari =
      Math.ceil(
        (new Date(dto.tanggal_selesai).getTime() -
          new Date(dto.tanggal_mulai).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    const estimasiBiaya = Number(fasilitas.harga_per_hari) * selisihHari;

    const booking = this.bookingRepo.create({
      fasilitas_id: fasilitasId,
      user_nik: userNik,
      nama_acara: dto.nama_acara,
      tanggal_mulai: dto.tanggal_mulai,
      tanggal_selesai: dto.tanggal_selesai,
      estimasi_peserta: dto.estimasi_peserta,
      dokumen_url: dto.dokumen_url,
      estimasi_biaya: estimasiBiaya,
      kode_bayar: `ISL-${uuidv4().slice(0, 8).toUpperCase()}`,
      status: 'pending_review',
    });

    const saved = await this.bookingRepo.save(booking);
    return saved;
  }

  async riwayatSaya(userNik: string) {
    return this.bookingRepo.find({
      where: { user_nik: userNik },
      relations: ['fasilitas'],
      order: { created_at: 'DESC' },
    });
  }

  // admin
  async createFasilitas(dto: CreateFasilitasDto) {
    const fasilitas = this.fasilitasRepo.create(dto);
    const saved = await this.fasilitasRepo.save(fasilitas);
    await this.cache.del(FASILITAS_CACHE_KEY);
    return saved;
  }

  async findAllBooking(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.bookingRepo.find({
      where,
      relations: ['fasilitas'],
      order: { created_at: 'DESC' },
    });
  }

  async approveBooking(id: string, adminNik: string) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking tidak ditemukan');
    if (booking.status !== 'pending_review')
      throw new ConflictException('Booking sudah diproses');

    booking.status = 'disetujui';
    booking.reviewed_by = adminNik;
    booking.reviewed_at = new Date();
    return this.bookingRepo.save(booking);
  }

  async tolakBooking(id: string, adminNik: string, dto: TolakBookingDto) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking tidak ditemukan');
    if (booking.status !== 'pending_review')
      throw new ConflictException('Booking sudah diproses');

    booking.status = 'ditolak';
    booking.reviewed_by = adminNik;
    booking.reviewed_at = new Date();
    booking.catatan_admin = dto.catatan_admin;
    return this.bookingRepo.save(booking);
  }
}
