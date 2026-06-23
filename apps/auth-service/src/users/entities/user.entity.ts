import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RefreshTokenEntity } from '../../refresh-tokens/entities/refresh-token.entity';

@Entity({ schema: 'auth', name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16, unique: true })
  nik!: string;

  @Column({ type: 'varchar', length: 255 })
  nama!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  no_hp!: string;

  @Column({ type: 'text', nullable: true })
  alamat!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refresh_tokens!: RefreshTokenEntity[];
}