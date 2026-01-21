import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  // Guarda el hash, no la contraseña en texto plano
  @Column()
  password: string;

  @Column({ default: true })
  isactive: boolean;

  @Column({ default: 0 })
  loginattempts: number;

  @Column({ default: false })
  islocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastlockedat: Date | null;

  @Column({ unique: true, nullable: true })
  email: string;

  @OneToMany(() => Auth, (auth) => auth.user)
  auths: Auth[];
}
