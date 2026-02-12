import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces/hooks/on-init.interface';
import { Role } from './role.entity';
import { DatabaseService } from 'src/common-elsy/database/database.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
    // private readonly databaseService: DatabaseService,
  ) {}
  async findByRole(name: string): Promise<Role> {
    return await this.rolesRepo.findOne({ where: { name } });
  }
  async onModuleInit() {
    const role = 'Administrator';
    const exists = await this.findByRole(role);
    console.log(`🔍 Verificando existencia del rol '${role}'...`);
    if (!exists) {
      await this.rolesRepo.save({
        name: role,
        description: 'Administrator role with full permissions',
      });
      console.log('✔ Rol Administrator creado automáticamente');
    } else {
      console.log('x Rol Administrator ya existe');
    }
  }
}
