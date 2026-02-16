import { Injectable, BadRequestException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces/hooks/on-init.interface';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Route } from '../routes/route.entity';
import { DatabaseService } from 'src/common/database/database.service';
import { QueryRoleDto } from './dtos/query-role.dto';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    private readonly databaseService: DatabaseService,
  ) {}
  async findByRole(name: string): Promise<Role> {
    return await this.roleRepo.findOne({ where: { name } });
  }
  async onModuleInit() {
    const role = 'Administrator';
    const exists = await this.findByRole(role);
    console.log(`🔍 Verificando existencia del rol '${role}'...`);
    if (!exists) {
      await this.roleRepo.save({
        name: role,
        description: 'Administrator role with full permissions',
      });
      console.log('✔ Rol Administrator creado automáticamente');
    } else {
      console.log('x Rol Administrator ya existe');
    }
  }

  async addRoutesToRole(roleId: number, routeIds: number[]): Promise<Role> {
    // Buscar el rol
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['routes'],
    });
    if (!role) throw new NotFoundException('Role not found');

    // Buscar las rutas
    const routes = await this.routeRepo.findByIds(routeIds);
    if (!routes.length) throw new NotFoundException('Routes not found');

    // Agregar las rutas al rol
    role.routes = [...role.routes, ...routes];

    // Guardar cambios
    return await this.roleRepo.save(role);
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepo.findOne({
      where: { name: createRoleDto.name },
    });
    if (exists) {
      throw new BadRequestException('Role already exists');
    }

    const role = this.roleRepo.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    return await this.roleRepo.save(role);
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id: updateRoleDto.id },
    });
    if (!role) throw new NotFoundException('Role not found');

    // If name is changing, verify uniqueness
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const exists = await this.roleRepo.findOne({
        where: { name: updateRoleDto.name },
      });
      if (exists) throw new BadRequestException('Role already exists');
    }

    role.name = updateRoleDto.name;
    role.description = updateRoleDto.description ?? role.description;

    return await this.roleRepo.save(role);
  }

  async advancedQuery(dto: QueryRoleDto) {
    return await this.databaseService.advancedQuery(Role, dto, 'role');
  }
}
