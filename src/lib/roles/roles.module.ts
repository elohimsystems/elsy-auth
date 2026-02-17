import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';
import { Route } from 'src/lib/routes/route.entity';
import { PermissionsService } from 'src/lib/permission/permission.service';
import { DatabaseModule } from 'src/lib/common/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Route]), DatabaseModule],
  providers: [RolesService, PermissionsService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule.forFeature([Role])],
})
export class RolesModule {}
