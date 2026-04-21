import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Poli } from '../../poli/entities/poli.entity';
import { Dokter } from './dokter.entity';

@Entity({ schema: 'rsud', name: 'jadwal_dokter' })
export class JadwalDokter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  dokter_id!: string;

  @Column('uuid')
  poli_id!: string;

  @Column({ type: 'varchar', length: 10 })
  hari!: string;

  @Column({ type: 'time', nullable: true })
  jam_mulai!: string;

  @Column({ type: 'time', nullable: true })
  jam_selesai!: string;

  @Column({ default: 30 })
  kuota_per_hari!: number;

  @ManyToOne(() => Dokter, (d) => d.jadwal)
  @JoinColumn({ name: 'dokter_id' })
  dokter!: Dokter;

  @ManyToOne(() => Poli, (p) => p.jadwal)
  @JoinColumn({ name: 'poli_id' })
  poli!: Poli;
}
