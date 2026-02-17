import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/lib/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/lib/permission/permissions.guard';
import { QueryRoleDto } from './dtos/query-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  async create(@Body(new ValidationPipe()) createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Post('update')
  async update(@Body(new ValidationPipe()) updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto);
  }

  @Post('list')
  async list(@Body(new ValidationPipe()) queryDto: QueryRoleDto) {
    return this.rolesService.advancedQuery(queryDto);
  }

  @Post(':id/routes')
  async addRoutes(
    @Param('id') roleId: number,
    @Body('routeIds') routeIds: number[],
  ) {
    return this.rolesService.addRoutesToRole(roleId, routeIds);
  }
}
