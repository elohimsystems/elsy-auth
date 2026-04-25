import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Type, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseUser, IUser, USER_ENTITY_KEY, ROLE_ENTITY_KEY, ROUTE_ENTITY_KEY } from '../interfaces/user.interface';

export interface ElsyAuthConfig {
  userEntity: Type<IUser>;
  roleEntity: Type<any>;
  routeEntity?: Type<any>;
  jwtSecret: string;
  jwtExpiration: string;
  maxAttempts: number;
  lockDuration: string; // e.g., '1h', '3600s'
}

export const AUTH_CONFIG = 'ELSY_AUTH_CONFIG';

@Module({})
export class ElsyAuthConfigModule {
  static forRoot(config: ElsyAuthConfig): DynamicModule {
    return {
      module: ElsyAuthConfigModule,
      providers: [
        {
          provide: AUTH_CONFIG,
          useValue: config,
        },
      ],
      exports: [
        {
          provide: AUTH_CONFIG,
          useValue: config,
        },
      ],
      global: true,
    };
  }
}

@Module({})
export class ElsyAuthModule {
  static forRoot(config: ElsyAuthConfig): DynamicModule {
    return {
      module: ElsyAuthModule,
      imports: [ElsyAuthConfigModule.forRoot(config)],
      exports: [ElsyAuthConfigModule],
    };
  }
}