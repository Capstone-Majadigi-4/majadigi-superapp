import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FotoDestinasi }
from './foto-destinasi.entity';

import { TiketPembelian }
from './tiket-pembelian.entity';

@Entity('destinasi', {
  schema: 'wisata',
})
export class Destinasi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nama: string;

  @Column({
    nullable: true,
  })
  deskripsi: string;

  @Column({
    nullable: true,
  })
  kategori: string;

  @Column({
    nullable: true,
  })
  kota: string;

  @Column({
    nullable: true,
  })
  kab_kota: string;

  @Column({
    nullable: true,
  })
  alamat: string;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  lat: number;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  lng: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  tiket_dewasa: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  tiket_anak: number;

  @Column({
    type: 'time',
    nullable: true,
  })
  jam_buka: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  jam_tutup: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  fasilitas: string[];

  @Column({
    type: 'numeric',
    nullable: true,
  })
  rating: number;

  @Column({
    default: true,
  })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => FotoDestinasi,
    (foto) => foto.destinasi,
  )
  foto: FotoDestinasi[];

  @OneToMany(
    () => TiketPembelian,
    (tiket) => tiket.destinasi,
  )
  tiket: TiketPembelian[];
}