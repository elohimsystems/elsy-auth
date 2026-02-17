import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { Role } from 'src/lib/roles/role.entity';

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

  @Column({ unique: true, nullable: false })
  email: string;

  @OneToMany(() => Auth, (auth) => auth.user)
  auths: Auth[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
