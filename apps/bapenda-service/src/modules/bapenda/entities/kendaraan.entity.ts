import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { TagihanPajak } from './tagihan-pajak.entity';

@Entity('kendaraan', { schema: 'bapenda' })
export class Kendaraan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nik_pemilik: string;

  @Column()
  nopol: string;

  @Column()
  merk: string;

  @Column()
  tipe: string;

  @Column()
  tahun: number;

  @Column()
  warna: string;
  @OneToMany(
    () => TagihanPajak,
    (tagihan) => tagihan.kendaraan,
  )
  tagihan: TagihanPajak[];
}