import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Poli } from '../../poli/entities/poli.entity';
import { Dokter } from './dokter.entity';

@Entity({ schema: 'rsud', name: 'antrean' })
export class Antrean {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  user_nik!: string;

  @Column('uuid')
  poli_id!: string;

  @Column('uuid')
  dokter_id!: string;

  @Column({ type: 'date' })
  tanggal!: string;

  @Column({ type: 'varchar', length: 10 })
  nomor_antrean!: string;

  @Column({ type: 'time', nullable: true })
  estimasi_jam!: string;

  @Column({ type: 'text', nullable: true })
  qr_checkin!: string;

  @Column({ type: 'varchar', length: 20, default: 'menunggu' })
  status!: string;

  @Column({ type: 'timestamp', nullable: true })
  dipanggil_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Poli)
  @JoinColumn({ name: 'poli_id' })
  poli!: Poli;

  @ManyToOne(() => Dokter)
  @JoinColumn({ name: 'dokter_id' })
  dokter!: Dokter;
}
