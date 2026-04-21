import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Poli } from '../../poli/entities/poli.entity';

export enum StatusAntrean {
  MENUNGGU = 'menunggu',
  DIPANGGIL = 'dipanggil',
  SELESAI = 'selesai',
  BATAL = 'batal',
}

@Entity({ schema: 'rsud', name: 'antrean' })
export class Antrean {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 16 })
  user_nik!: string;

  @Column()
  poli_id!: number;

  @Column()
  dokter_id!: number;

  @Column({ type: 'date' })
  tanggal!: string;

  @Column()
  nomor_antrean!: number;

  @Column({ type: 'time' })
  estimasi_jam!: string;

  @Column({ nullable: true })
  qr_checkin!: string;

  @Column({
    type: 'enum',
    enum: StatusAntrean,
    default: StatusAntrean.MENUNGGU,
  })
  status!: StatusAntrean;

  @Column({ type: 'timestamp', nullable: true })
  dipanggil_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Poli)
  @JoinColumn({ name: 'poli_id' })
  poli!: Poli;
}
