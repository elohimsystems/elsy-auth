import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../roles/role.entity';

export abstract class BaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

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

  @Column({ unique: true, nullable: false })
  email: string;
}

export interface IUser extends BaseUser {
  roles: Role[];
}

export const USER_ENTITY_KEY = 'USER_ENTITY';
export const ROLE_ENTITY_KEY = 'ROLE_ENTITY';
export const ROUTE_ENTITY_KEY = 'ROUTE_ENTITY';