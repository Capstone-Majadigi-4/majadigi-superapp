import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Koridor } from '../../koridor/entities/koridor.entity';

@Entity({ schema: 'transjatim', name: 'halte' })
export class Halte {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  koridor_id!: string;

  @Column({ type: 'varchar', length: 200 })
  nama!: string;

  @Column({ type: 'smallint' })
  urutan!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng!: number;

  @ManyToOne(() => Koridor, (k) => k.halte)
  @JoinColumn({ name: 'koridor_id' })
  koridor!: Koridor;
}
