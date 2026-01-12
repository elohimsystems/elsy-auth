// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  // Registro: crea usuario con contraseña hasheada
  async register(username: string, password: string) {
    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hash = await argon2.hash(password); // Argon2 hash

    const user = this.userRepository.create({
      username,
      password: hash,
    });

    const saved = await this.userRepository.save(user);

    // No devolvemos el password
    return {
      id: saved.id,
      username: saved.username,
      message: 'Usuario registrado correctamente',
    };
  }

  // Login: valida usuario + contraseña con Argon2
  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !user.isactive) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 1. Verificar si está bloqueado
    if (user.islocked) {
      throw new ForbiddenException('Usuario bloqueado por múltiples intentos fallidos');
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      // Incrementar intentos fallidos
      user.loginattempts += 1;

      // Bloquear si supera el límite
      if (user.loginattempts >= parseInt(this.configService.get<string>('MAX_ATTEMPTS'))) {
        user.islocked = true;
        user.lockedat = new Date();
      }
      
      await this.userRepository.save(user);

      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Si el login es correcto, reiniciar intentos
    user.loginattempts = 0;
    await this.userRepository.save(user);

    return {
      id: user.id,
      username: user.username,
      message: 'Login correcto',
    };
  }
}