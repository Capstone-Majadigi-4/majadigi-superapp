import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'islamic', name: 'fasilitas' })
export class Fasilitas {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nama!: string;

  @Column({ type: 'int', nullable: true })
  kapasitas!: number;

  @Column({ type: 'bigint', default: 0 })
  harga_per_hari!: number;

  @Column({ type: 'text', nullable: true })
  deskripsi!: string;

  @Column({ type: 'text', nullable: true })
  foto_url!: string;

  @Column({ default: true })
  is_active!: boolean;
}
