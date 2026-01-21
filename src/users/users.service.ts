import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // Crear usuario con Argon2
  async create(
    username: string,
    password: string,
    email: string,
  ): Promise<User> {
    const exists = await this.usersRepo.findOne({ where: { username } });
    if (exists) {
      throw new BadRequestException('User already registered');
    }

    const hashed = await argon2.hash(password);

    const user = this.usersRepo.create({
      username: username,
      password: hashed,
      email: email,
      isactive: true,
      loginattempts: 0,
      lastlockedat: null,
    });

    return this.usersRepo.save(user);
  }

  async update(user: User) {
    return this.usersRepo.save(user);
  }

  // Buscar por email
  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  // Buscar por id
  async findById(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Verificar contraseña
  async validatePassword(user: User, password: string) {
    return argon2.verify(user.password, password);
  }

  // Registrar intento fallido
  async registerFailedAttempt(
    user: User,
    maxAttempts: number,
    blockMinutes: string,
  ) {
    user.loginattempts += 1;

    if (user.loginattempts >= maxAttempts) {
      const blockUntil = new Date();
      // blockUntil.setMinutes(blockUntil.getMinutes() + blockMinutes);
      blockUntil.setMinutes(blockUntil.getMinutes() + parseInt(blockMinutes));
      user.lastlockedat = blockUntil;
      user.islocked = true;
    }

    await this.usersRepo.save(user);
  }

  // Resetear intentos después de login exitoso
  async resetLoginAttempts(user: User) {
    user.loginattempts = 0;
    user.lastlockedat = null;
    user.islocked = false;
    await this.usersRepo.save(user);
  }

  // Verificar si está bloqueado
  isBlocked(user: User) {
    if (!user.lastlockedat) return false;
    return user.lastlockedat > new Date();
  }
}
