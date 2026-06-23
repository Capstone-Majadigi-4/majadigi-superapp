import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fasilitas } from './fasilitas.entity';

@Entity({ schema: 'islamic', name: 'booking_fasilitas' })
export class BookingFasilitas {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  fasilitas_id!: string;

  @Column({ type: 'varchar', length: 16 })
  user_nik!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_acara!: string;

  @Column({ type: 'date' })
  tanggal_mulai!: string;

  @Column({ type: 'date' })
  tanggal_selesai!: string;

  @Column({ type: 'int', nullable: true })
  estimasi_peserta!: number;

  @Column({ type: 'text', nullable: true })
  dokumen_url!: string;

  @Column({ type: 'bigint', nullable: true })
  estimasi_biaya!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  kode_bayar!: string;

  @Column({ type: 'varchar', length: 20, default: 'pending_review' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  catatan_admin!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  reviewed_by!: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at!: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  @ManyToOne(() => Fasilitas)
  @JoinColumn({ name: 'fasilitas_id' })
  fasilitas!: Fasilitas;
}
