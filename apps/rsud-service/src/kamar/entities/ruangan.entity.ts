import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'rsud', name: 'ruangan' })
export class Ruangan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nama!: string;

  @Column({ type: 'varchar', length: 50 })
  kelas!: string;

  @Column({ type: 'int', default: 0 })
  kapasitas!: number;

  @Column({ type: 'int', default: 0 })
  terisi!: number;

  @Column({ default: true })
  is_active!: boolean;
}
