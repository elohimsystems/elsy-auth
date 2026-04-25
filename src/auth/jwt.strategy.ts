import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { AUTH_CONFIG, ElsyAuthConfig } from '../common/config/elsy-auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    @Inject(AUTH_CONFIG) private config: ElsyAuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
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
