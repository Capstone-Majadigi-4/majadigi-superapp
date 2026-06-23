import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JadwalDokter } from './jadwal-dokter.entity';

@Entity({ schema: 'rsud', name: 'dokter' })
export class Dokter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  nama!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  spesialis!: string;

  @Column({ type: 'text', nullable: true })
  foto_url!: string;

  @Column({ default: true })
  is_active!: boolean;

  @OneToMany(() => JadwalDokter, (j) => j.dokter)
  jadwal!: JadwalDokter[];
}
