import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'darurat',
  name: 'instansi',
})
export class Instansi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nama: string;

  @Column()
  kategori: string;

  @Column()
  nomor: string;

  @Column()
  nomor_cepat: string;

  @Column()
  kota: string;

  @Column()
  provinsi: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  aktif_24jam: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;
}