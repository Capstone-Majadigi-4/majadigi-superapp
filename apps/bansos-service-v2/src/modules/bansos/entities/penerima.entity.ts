import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Program }
from './program.entity';

@Entity({
  schema: 'bansos',
  name: 'penerima',
})
export class Penerima {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Program,
  )
  @JoinColumn({
    name: 'program_id',
  })
  program: Program;

  @Column()
  user_nik: string;

  @Column({
    nullable: true,
  })
  nama: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  nominal: number;

  @Column({
    nullable: true,
  })
  status_pencairan: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  sp2d_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  bank_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  cair_at: Date;

  @Column({
    nullable: true,
  })
  via_bank: string;

  @UpdateDateColumn()
  updated_at: Date;
}