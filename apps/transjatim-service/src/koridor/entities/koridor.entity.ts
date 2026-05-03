
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Halte } from '../../halte/entities/halte.entity';

@Entity({ schema: 'transjatim', name: 'koridor' })
export class Koridor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  kode!: string;

  @Column({ type: 'varchar', length: 255 })
  nama!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  asal!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  tujuan!: string;

  @Column({ default: true })
  is_active!: boolean;

  @OneToMany(() => Halte, (h) => h.koridor)
  halte!: Halte[];
}
