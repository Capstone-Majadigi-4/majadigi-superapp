import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Lowongan } from './lowongan.entity';

@Entity('lamaran', {
  schema: 'sinaker',
})
export class Lamaran {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_nik: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  matching_score: number;

  @Column({
    nullable: true,
  })
  catatan: string;

  @Column({
    nullable: true,
  })
  portfolio_url: string;

  @Column({
    default: 'submitted',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => Lowongan,
    (lowongan) => lowongan.lamaran,
  )
  @JoinColumn({
    name: 'lowongan_id',
  })
  lowongan: Lowongan;
}