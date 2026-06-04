import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'etibi',
  name: 'pertanyaan_skrining',
})
export class PertanyaanSkrining {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  teks: string;

  @Column({
    type: 'smallint',
  })
  bobot: number;

  @Column({
    type: 'smallint',
  })
  urutan: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;
}