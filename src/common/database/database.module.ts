import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { ENTITIES } from 'src/config/db-entities';
import { DatabaseType } from './database-type.enum';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const logger = new Logger('DatabaseModule');
        try {
          // Debug: imprime valores para verificar que llegan
          console.log('DB_TYPE', config.get('DB_TYPE'));
          console.log('DB_HOST', config.get('DB_HOST'));
          console.log('DB_PORT', config.get('DB_PORT'));

          const dbType = config.get<string>('DB_TYPE');
          // Validar tipo
          const validTypes = Object.values(DatabaseType);
          if (!validTypes.includes(dbType as DatabaseType)) {
            logger.error(
              `Invalid database type: "${dbType}". Supported types: ${validTypes.join(', ')}`,
            );
            throw `Invalid database type`;
          }

          // Asegurarse types correctos
          const port = parseInt(config.get<string>('DB_PORT', '5432'), 10);
          return {
            manualInitialization: true,
            type: config.get<any>('DB_TYPE'),
            host: config.get<string>('DB_HOST'),
            port: port,
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_NAME'),
            entities: ENTITIES,
            synchronize: true,
            // logging: true,
          }; //as TypeOrmModuleOptions
        } catch (error) {
          // console.error('Error in database configuration:', error);
          throw `Error in database configuration: ${(error as any)?.message || error}`;
        }
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
