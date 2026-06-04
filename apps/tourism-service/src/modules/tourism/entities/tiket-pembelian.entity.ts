import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Destinasi }
from './destinasi.entity';

@Entity('tiket_pembelian', {
  schema: 'wisata',
})
export class TiketPembelian {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_nik: string;

  @Column({
    type: 'date',
  })
  tanggal_kunjungan: Date;

  @Column({
    type: 'smallint',
  })
  jumlah_dewasa: number;

  @Column({
    type: 'smallint',
  })
  jumlah_anak: number;

  @Column({
    type: 'bigint',
  })
  total: number;

  @Column({
    nullable: true,
  })
  qr_payload: string;

  @Column({
    nullable: true,
  })
  status: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  digunakan_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(
    () => Destinasi,
    (destinasi) => destinasi.tiket,
  )
  @JoinColumn({
    name: 'destinasi_id',
  })
  destinasi: Destinasi;
}