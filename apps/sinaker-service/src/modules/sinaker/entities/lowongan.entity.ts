import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Lamaran }
from './lamaran.entity';

import { Perusahaan }
from './perusahaan.entity';

@Entity('lowongan', {
  schema: 'sinaker',
})
export class Lowongan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  judul: string;

  @Column({
    nullable: true,
  })
  deskripsi: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  kualifikasi: string[];

  @Column({
    nullable: true,
  })
  kota: string;

  @Column({
    nullable: true,
  })
  tipe_kerja: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  gaji_min: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  gaji_max: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  deadline: Date;

  @Column({
    default: 'aktif',
  })
  status: string;

  @Column({
    type: 'timestamp',
    default: () =>
      'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(
    () => Perusahaan,
    (perusahaan) =>
      perusahaan.lowongan,
  )
  @JoinColumn({
    name: 'perusahaan_id',
  })
  perusahaan: Perusahaan;

  @OneToMany(
    () => Lamaran,
    (lamaran) =>
      lamaran.lowongan,
  )
  lamaran: Lamaran[];
}