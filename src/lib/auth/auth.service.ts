// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../users/user.entity';
import { Auth } from './entities/auth.entity';
import { EventAuth } from './entities/eventauth.entity';
import { UsersService } from 'src/lib/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(EventAuth)
    private readonly eventAuthRepository: Repository<EventAuth>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    if (!user || !user.isactive) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.islocked) {
      this.createAuth(user, 'USER_BLOCKED');
      throw new UnauthorizedException(
        'Usuario bloqueado por intentos fallidos',
      );
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      await this.userService.registerFailedAttempt(
        user,
        parseInt(process.env.MAX_ATTEMPTS),
        '3600s',
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.userService.resetLoginAttempts(user);
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    // const token = this.jwtService.sign(payload);
    // console.log('DECODED:', this.jwtService.decode(token));

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async createAuth(user: User, eventCode: string) {
    const eventAuth = await this.eventAuthRepository.findOneBy({
      code: eventCode,
    });
    const authUser = await this.authRepository.create({
      user: user,
      event: eventAuth,
      eventat: new Date(),
    });
    await this.authRepository.save(authUser);
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token); // 👈 VERIFICAR TOKEN
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token); // 👈 DECODIFICAR SIN VALIDAR
  }
}
