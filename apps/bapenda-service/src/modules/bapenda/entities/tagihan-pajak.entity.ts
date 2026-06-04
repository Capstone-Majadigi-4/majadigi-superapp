import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { TransaksiPembayaran } from './transaksi-pembayaran.entity';
import { Kendaraan } from './kendaraan.entity';

@Entity('tagihan_pajak', { schema: 'bapenda' })
export class TagihanPajak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  periode: string;

  @Column()
  pokok_pkb: number;

  @Column()
  denda: number;

  @Column()
  adm_stnk: number;

  @Column()
  total: number;

  @Column()
  status: string;

  @Column()
  jatuh_tempo: Date;

  @ManyToOne(() => Kendaraan)
  @JoinColumn({ name: 'kendaraan_id' })
  kendaraan: Kendaraan;

  @OneToMany(
  () => TransaksiPembayaran,
  (pembayaran) => pembayaran.tagihan,
)
pembayaran: TransaksiPembayaran[];
}