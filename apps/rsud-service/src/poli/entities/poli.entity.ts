import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JadwalDokter } from '../../antrean/entities/jadwal-dokter.entity';

@Entity({ schema: 'rsud', name: 'poli' })
export class Poli {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nama!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  lantai!: string;

  @Column({ default: true })
  is_active!: boolean;

  @OneToMany(() => JadwalDokter, (j) => j.poli)
  jadwal!: JadwalDokter[];
}
