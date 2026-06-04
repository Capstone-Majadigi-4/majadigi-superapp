import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PasienAktif }
from './pasien-aktif.entity';

@Entity({
  schema: 'etibi',
  name: 'log_konfirmasi',
})
export class LogKonfirmasi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => PasienAktif,
  )
  @JoinColumn({
    name: 'pasien_id',
  })
  pasien: PasienAktif;

  @Column({
    type: 'date',
  })
  tanggal: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  dikonfirmasi: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  timestamp_konfirmasi: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;
}