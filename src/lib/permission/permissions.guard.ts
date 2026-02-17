import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './permission.decorator';
import { PermissionsService } from './permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    // Si la ruta no requiere permiso, se permite
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const path = request.route.path;
    const roleIds = user.roles.map((r) => r.id);

    // Si es ADMIN, acceso total
    if (user.role === 'Administrator') return true;

    const canAccess = await this.permissionsService.canAccessRoute(
      roleIds,
      method,
      path,
    );
    if (!canAccess) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta ruta',
      );
    }

    return true;
  }
}
