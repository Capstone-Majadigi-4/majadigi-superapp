import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Lowongan } from './lowongan.entity';

@Entity('perusahaan', {
  schema: 'sinaker',
})
export class Perusahaan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nama: string;

  @Column({
    nullable: true,
  })
  industri: string;

  @Column({
    nullable: true,
  })
  kota: string;

  @Column({
    nullable: true,
  })
  logo_url: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    nullable: true,
  })
  admin_nik: string;

@OneToMany(
  () => Lowongan,
  (lowongan) => lowongan.perusahaan,
)
lowongan: Lowongan[];
}