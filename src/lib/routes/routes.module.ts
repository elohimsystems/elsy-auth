import { Module } from '@nestjs/common';
import { Route } from './route.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PermissionsService } from 'src/lib/permission/permission.service';
import { DatabaseModule } from 'src/lib/common/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Route]), DatabaseModule],
  providers: [RoutesService, PermissionsService],
  exports: [RoutesService],
  controllers: [RoutesController],
})
export class RoutesModule {}
