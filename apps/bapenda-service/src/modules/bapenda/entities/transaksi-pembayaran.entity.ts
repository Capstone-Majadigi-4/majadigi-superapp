import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TagihanPajak } from './tagihan-pajak.entity';

@Entity('transaksi_pembayaran', {
  schema: 'bapenda',
})
export class TransaksiPembayaran {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  kode_bayar: string;

  @Column()
  metode: string;

  @Column()
  bank_code: string;

  @Column()
  total: number;

  @Column()
  status: string;

  @Column()
  pg_reference: string;

  @Column()
  expired_at: Date;

  @ManyToOne(() => TagihanPajak)
  @JoinColumn({ name: 'tagihan_id' })
  tagihan: TagihanPajak;
}