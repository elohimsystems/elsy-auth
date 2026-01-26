import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { QueryUsersDto } from './dtos/query-users.dto';
import { DatabaseService } from 'src/common-elsy/database/database.service';
import { SendChangePasswordEmailDto } from './dtos/send-passwordchange-email.dto';
import { MailService } from 'src/common-elsy/mail/mail.service';
import { ChangePasswordUserDto } from './dtos/changepassword-user.dto';
import { UnlockUserDto } from './dtos/unlock-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
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
    return await this.usersRepo.save(user);
  }

  async update(userDto: UpdateUserDto): Promise<User> {
    await this.findById(userDto.id);
    await this.UsernameExit(userDto.username);
    userDto.password = await argon2.hash(userDto.password);
    const user = Object.assign(new User(), userDto);
    return await this.usersRepo.save(user);
  }

  async deactivate(userId: number): Promise<Boolean> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isactive = false;
    await this.usersRepo.save(user);
    return true;
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

  async UsernameExit(username: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (user) throw new NotFoundException('User already exists');
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

  async advancedQuery(dto: QueryUsersDto) {
    const { select, and, or } = dto;

    const query = this.usersRepo.createQueryBuilder('user');

    // SELECT dinámico
    if (select?.length) {
      select.forEach((field) => {
        if (!this.databaseService.fieldExists(User, field)) {
          throw new BadRequestException('Invalid field in select: ' + field);
        }
      });
      query.select(select.map((f) => `user.${f}`));
    }

    // AND conditions
    if (and?.length) {
      and.forEach((cond, index) => {
        const paramKey = `and_${index}`;
        if (!this.databaseService.fieldExists(User, cond.field)) {
          throw new BadRequestException(
            'Invalid field in AND condition: ' + cond.field,
          );
        }
        query.andWhere(`user.${cond.field} ${cond.operator} :${paramKey}`, {
          [paramKey]: cond.value,
        });
      });
    }

    // OR conditions
    if (or?.length) {
      const orExpressions = or.map((cond, index) => {
        const paramKey = `or_${index}`;
        if (!this.databaseService.fieldExists(User, cond.field)) {
          throw new BadRequestException(
            'Invalid field in OR condition: ' + cond.field,
          );
        }
        return `user.${cond.field} ${cond.operator} :${paramKey}`;
      });

      const orParams = {};
      or.forEach((cond, index) => {
        orParams[`or_${index}`] = cond.value;
      });

      query.orWhere(orExpressions.join(' OR '), orParams);
    }

    return query.getMany();
  }

  async sendPasswordChangeEmail(body: SendChangePasswordEmailDto) {
    if (!(await this.findByEmail(body.email))) {
      throw new NotFoundException('Email not found');
    }
    await this.mailService.sendSimpleEmail(
      body.email,
      `Hemos recibido una solicitud para cambiar su contraseña. Si no realizó esta solicitud, ignore este correo.
      Para cambiar su contraseña, haga clic en el siguiente enlace: ${process.env.LINK_CHANGE_PASSWORD}       
      `,
    );
    return true;
  }
  async changePassword(body: ChangePasswordUserDto) {
    const user = await this.findById(body.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashed = await argon2.hash(body.password);
    user.password = hashed;
    await this.usersRepo.save(user);
    return true;
  }

  async unlock(body: UnlockUserDto) {
    const user = await this.findByUsername(body.username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.islocked = false;
    user.loginattempts = 0;
    user.lastlockedat = null;
    await this.usersRepo.save(user);
    return true;
  }
}
