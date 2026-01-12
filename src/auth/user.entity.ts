import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  lockedat: Date | null;

}