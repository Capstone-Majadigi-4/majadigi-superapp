import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profil_pencari', {
  schema: 'sinaker',
})
export class ProfilPencari {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_nik: string;

  @Column({
    nullable: true,
  })
  ringkasan: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  skill: string[];

@Column({
  type: 'jsonb',
  nullable: true,
})
pendidikan: any;

@Column({
  type: 'jsonb',
  nullable: true,
})
pengalaman: any;

  @Column({
    nullable: true,
  })
  portfolio_url: string;

  @UpdateDateColumn()
  updated_at: Date;
}