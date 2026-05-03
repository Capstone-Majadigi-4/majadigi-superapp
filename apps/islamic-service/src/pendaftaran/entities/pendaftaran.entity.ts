import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Acara } from '../../acara/entities/acara.entity';

@Entity({ schema: 'islamic', name: 'pendaftaran_acara' })
export class PendaftaranAcara {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  acara_id!: string;

  @Column({ type: 'varchar', length: 16 })
  user_nik!: string;

  @Column({ type: 'text', nullable: true })
  qr_payload!: string;

  @Column({ type: 'varchar', length: 20, default: 'valid' })
  status!: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  daftar_at!: Date;

  @ManyToOne(() => Acara)
  @JoinColumn({ name: 'acara_id' })
  acara!: Acara;
}
