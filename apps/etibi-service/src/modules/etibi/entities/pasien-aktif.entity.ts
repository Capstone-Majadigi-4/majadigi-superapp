import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'etibi',
  name: 'pasien_aktif',
})
export class PasienAktif {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  user_nik: string;

  @Column({
    type: 'varchar',
  })
  nama: string;

  @Column({
    type: 'varchar',
  })
  fase_pengobatan: string;

  @Column({
    type: 'date',
  })
  tanggal_mulai: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  tanggal_selesai: Date;

  @Column({
    type: 'time',
  })
  jam_minum_obat: string;

  @Column({
    type: 'varchar',
  })
  faskes_id: string;

  @Column({
    type: 'varchar',
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;
}