import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { EventAuth } from './eventauth.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.auths)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => EventAuth, (eventauth) => eventauth.auths)
  @JoinColumn({ name: 'event_id' })
  event: EventAuth;

  @Column({ type: 'timestamp', nullable: false })
  eventat: Date | null;
}
