import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    });
    console.log('JWT SECRET:', process.env.JWT_SECRET);
    console.log('🔥 JwtStrategy inicializada correctamente');
  }
  
  // async validate(payload: any) {
  //   // Lo que retornes aquí se adjunta a req.user
  //   console.log('JWT STRATEGY VALIDANDO TOKEN...');
  //   return {
  //     userId: payload.sub,
  //     email: payload.email,
  //     // roles: payload.roles,
  //   };
  // }
  async validate(req: any, payload: any) {
    const token = req.headers.authorization;

    console.log('🔍 TOKEN RECIBIDO:', token);
    console.log('📦 PAYLOAD DECODIFICADO:', payload);

    return payload;
  }

}