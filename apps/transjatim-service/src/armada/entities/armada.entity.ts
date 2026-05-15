import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'transjatim', name: 'armada' })
export class Armada {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  koridor_id!: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  kode_bus!: string;

  @Column({ type: 'smallint', nullable: true })
  kapasitas!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng!: number;

  @Column({ type: 'varchar', length: 20, default: 'aktif' })
  status!: string;

  @UpdateDateColumn()
  updated_at!: Date;
}
