import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string; // GET, POST, PUT, DELETE

  @Column()
  path: string; // /users, /auth/login

  @ManyToMany(() => Role, (role) => role.routes)
  roles: Role[];
}
