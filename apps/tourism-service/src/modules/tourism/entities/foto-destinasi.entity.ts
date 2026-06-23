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

@Entity('foto_destinasi', {
  schema: 'wisata',
})
export class FotoDestinasi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  urutan: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(
    () => Destinasi,
    (destinasi) => destinasi.foto,
  )
  @JoinColumn({
    name: 'destinasi_id',
  })
  destinasi: Destinasi;
}