import { Module } from '@nestjs/common';
import { Route } from './route.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
