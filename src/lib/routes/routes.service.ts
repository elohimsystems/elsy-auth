import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { QueryRouteDto } from './dtos/query-route.dto';
import { DatabaseService } from 'src/lib/common/database/database.service';

@Injectable()
export class RoutesService implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    private readonly databaseService: DatabaseService,
  ) {}

  async onModuleInit() {
    const httpAdapter = this.adapterHost.httpAdapter;
    const server = httpAdapter.getHttpServer();

    const router = server._events.request._router;

    const routes = [];

    router.stack.forEach((layer) => {
      if (layer.route) {
        const path = layer.route.path;
        const methods = Object.keys(layer.route.methods);

        methods.forEach((method) => {
          routes.push({
            path,
            method: method.toUpperCase(),
          });
        });
      }
    });

    // Guardar en BD evitando duplicados
    for (const r of routes) {
      const exists = await this.routeRepo.findOne({
        where: { path: r.path, method: r.method },
      });

      if (!exists) {
        await this.routeRepo.save(r);
      }
    }

    console.log('Rutas sincronizadas con la base de datos');
  }
  async advancedQuery(dto: QueryRouteDto) {
    return await this.databaseService.advancedQuery(Route, dto, 'route');
  }
}
