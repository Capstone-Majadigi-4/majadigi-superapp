import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({
  schema: 'bansos',
  name: 'program',
})
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nama: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  deskripsi: string;

  @Column()
  periode: string;

  @Column({
    nullable: true,
  })
  kuota: number;

  @Column({
    nullable: true,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}