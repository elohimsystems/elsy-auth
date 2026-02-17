import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/lib/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      // passReqToCallback: true,
    });
    // console.log('JWT SECRET:', process.env.JWT_SECRET);
    // console.log('🔥 JwtStrategy inicializada correctamente');
  }
  async validate(payload: any) {
    // Cargar el usuario completo con roles
    const user = await this.usersService.findByIdWithRoles(payload.sub);

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}
