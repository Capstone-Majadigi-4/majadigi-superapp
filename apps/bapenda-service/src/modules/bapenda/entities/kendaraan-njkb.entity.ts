import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('kendaraan_njkb', { schema: 'bapenda' })
export class KendaraanNjkb {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'jenis_kendaraan' })
  jenis_kendaraan: string;

  @Column()
  merk: string;

  @Column()
  model: string;

  @Column()
  tipe: string;

  @Column()
  tahun: number;

  @Column({ type: 'bigint' })
  njkb: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
