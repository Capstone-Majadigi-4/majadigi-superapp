import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'islamic', name: 'acara' })
export class Acara {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  judul!: string;

  @Column({ type: 'text', nullable: true })
  deskripsi!: string;

  @Column({ type: 'date' })
  tanggal!: string;

  @Column({ type: 'time', nullable: true })
  waktu_mulai!: string;

  @Column({ type: 'time', nullable: true })
  waktu_selesai!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lokasi!: string;

  @Column({ type: 'int' })
  kuota_maksimal!: number;

  @Column({ type: 'int', default: 0 })
  kuota_terisi!: number;

  @Column({ type: 'text', nullable: true })
  poster_url!: string;

  @Column({ type: 'varchar', length: 20, default: 'aktif' })
  status!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  dibuat_oleh!: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;
}
