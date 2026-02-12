import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { DataTable } from './datatable.entity';
import { Route } from '../routes/route.entity';
import { User } from 'src/users/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Route, (route) => route.roles)
  routes: Route[];

  @ManyToMany(() => DataTable, (dataTable) => dataTable.roles)
  datatables: DataTable[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
