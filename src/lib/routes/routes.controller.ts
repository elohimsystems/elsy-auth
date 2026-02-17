import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/lib/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/lib/permission/permissions.guard';
import { QueryRouteDto } from './dtos/query-route.dto';
import { RoutesService } from './routes.service';
import { Permission } from 'src/lib/permission/permission.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}
  @Permission('route.list')
  @Post('list')
  async list(@Body(new ValidationPipe()) queryRouteDto: QueryRouteDto) {
    return this.routesService.advancedQuery(queryRouteDto);
  }
}
