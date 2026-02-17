import { Role } from './role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('datatables')
export class DataTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // User, Product, Order

  @Column()
  tableName: string; // users, products, orders

  @Column({ nullable: true })
  canDelete: boolean;
  @Column({ nullable: true })
  canUpdate: boolean;
  @Column({ nullable: true })
  canCreate: boolean;
  @Column({ nullable: true })
  canRead: boolean;

  @ManyToMany(() => Role, (role) => role.datatables)
  @JoinTable({
    name: 'role_datatables',
    joinColumn: { name: 'datatable_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
