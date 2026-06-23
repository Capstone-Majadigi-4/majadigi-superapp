import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Program }
from './program.entity';

@Entity({
  schema: 'bansos',
  name: 'pengumuman',
})
export class Pengumuman {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  judul: string;

  @Column({
    name: 'konten',
    type: 'text',
    nullable: true,
  })
  konten: string;

  @ManyToOne(
    () => Program,
    {
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'program_id',
  })
  program: Program;

  @Column({
    nullable: true,
  })
  dibuat_oleh: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  aktif_dari: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  aktif_sampai: Date;

  @CreateDateColumn()
  created_at: Date;
}