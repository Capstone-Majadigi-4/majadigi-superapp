import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'darurat',
  name: 'laporan_panic',
})
export class LaporanPanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_nik: string;

  @Column()
  kategori: string;

  @Column({
    type: 'numeric',
  })
  latitude: number;

  @Column({
    type: 'numeric',
  })
  longitude: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  deskripsi: string;

  @Column()
  dikirim_ke: string;

  @Column()
  webhook_status: string;

  @CreateDateColumn()
  created_at: Date;
}