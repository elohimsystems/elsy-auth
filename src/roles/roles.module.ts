import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';
import { Route } from 'src/routes/route.entity';
import { PermissionsService } from 'src/permission/permission.service';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Route]), DatabaseModule],
  providers: [RolesService, PermissionsService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule.forFeature([Role])],
})
export class RolesModule {}
