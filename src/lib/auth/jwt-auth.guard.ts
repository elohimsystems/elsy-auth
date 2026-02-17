import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // const req = context.switchToHttp().getRequest();
    // console.log('🛂 JwtAuthGuard → canActivate()');
    // console.log('🔍 Authorization header:', req.headers.authorization);

    return super.canActivate(context);
  }

  // handleRequest(err, user, info) {
  //   // console.log('🛂 JwtAuthGuard → handleRequest()');
  //   // console.log('   ❗ err:', err);
  //   // console.log('   👤 user:', user);
  //   // console.log('   ℹ️ info:', info);

  //   if (err || !user) {
  //     throw err || new UnauthorizedException('Token inválido o ausente');
  //   }

  //   return user;
  // }
}
