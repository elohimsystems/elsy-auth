import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Auth } from './auth.entity';

@Entity()
export class EventAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Auth, auth => auth.user)
  auths: Auth[];  
}