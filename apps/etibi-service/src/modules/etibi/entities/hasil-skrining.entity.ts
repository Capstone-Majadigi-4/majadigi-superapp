import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'etibi',
  name: 'hasil_skrining',
})
export class HasilSkrining {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  user_nik: string;

  @Column({
    type: 'smallint',
  })
  skor: number;

  @Column({
    type: 'varchar',
  })
  kategori_risiko: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  perlu_followup: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;
}