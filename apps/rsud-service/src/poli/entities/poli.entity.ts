import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'rsud', name: 'poli' })
export class Poli {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nama!: string;
    
  @Column()
  lantai!: number;

  @Column({ default: true })
  is_active!: boolean;
}
