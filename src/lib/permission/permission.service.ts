import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Role } from '../roles/role.entity';

@Injectable()
export class PermissionsService {
  constructor(private dataSource: DataSource) {}
  async canAccessRoute(roleIds: number[], method: string, path: string) {
    const roleRepo = this.dataSource.getRepository(Role);

    const roles = await roleRepo.find({
      where: { id: In(roleIds) },
    });

    // Si alguno de los roles es super admin → acceso total
    if (roles.some((r) => r.name == 'Administrator')) {
      return true;
    }

    // Si no es super admin, validar permisos normales
    const rolesWithRoutes = await roleRepo.find({
      where: { id: In(roleIds) },
      relations: ['routes'],
    });

    const allowedRoutes = rolesWithRoutes.flatMap((r) => r.routes);

    return allowedRoutes.some(
      (route) => route.method === method && route.path === path,
    );
  }

  // async canAccessDataTable(roleIds: number[], dataTable: string) {
  //   const roleRepo = this.dataSource.getRepository(Role);

  //   const roles = await roleRepo.find({
  //     where: { id: In(roleIds) },
  //   });

  //   if (roles.some((r) => r.name == 'Administrator')) {
  //     return true;
  //   }

  //   const rolesWithDatatables = await roleRepo.find({
  //     where: { id: In(roleIds) },
  //     relations: ['datatables'],
  //   });

  //   const allowedDatatables = rolesWithDatatables.flatMap((r) => r.datatables);

  //   return allowedDatatables.some((entity) => entity.name === dataTable);
  // }
}
