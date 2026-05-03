import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Koridor } from '../../koridor/entities/koridor.entity';

@Entity({ schema: 'transjatim', name: 'tiket' })
export class Tiket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  user_nik!: string;

  @Column({ type: 'uuid' })
  koridor_id!: string;

  @Column({ type: 'smallint', default: 1 })
  jumlah!: number;

  @Column({ type: 'bigint' })
  total!: number;

  @Column({ type: 'text', nullable: true })
  qr_totp!: string; // menyimpan TOTP secret, bukan OTP-nya langsung

  @Column({ type: 'varchar', length: 20, default: 'valid' })
  status!: string; // valid | digunakan | expired

  @Column({ type: 'timestamp' })
  valid_sampai!: Date;

  @Column({ type: 'timestamp', nullable: true })
  digunakan_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Koridor)
  @JoinColumn({ name: 'koridor_id' })
  koridor!: Koridor;
}
