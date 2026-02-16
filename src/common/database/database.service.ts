// // database/database.service.ts
// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { QueryDatabaseDto } from './dtos/query-database.dto';
// import { BadRequestException, Logger } from '@nestjs/common';
// import { OnModuleInit } from '@nestjs/common/interfaces';
// import { InjectDataSource } from '@nestjs/typeorm';

// @Injectable()
// export class DatabaseService implements OnModuleInit {
//   private readonly logger = new Logger(DatabaseService.name);
//   constructor(
//     @InjectDataSource()
//     private readonly dataSource: DataSource,
//     // private readonly dataSource: DataSource,
//   ) {}

//   getRepository<T>(entity: new () => T): Repository<T> {
//     return this.dataSource.getRepository(entity);
//   }

//   async findAll<T>(entity: new () => T, options = {}) {
//     return this.getRepository(entity).find(options);
//   }

//   async findOne<T>(entity: new () => T, options = {}) {
//     return this.getRepository(entity).findOne(options);
//   }

//   async delete<T>(entity: new () => T, id: any) {
//     return this.getRepository(entity).delete(id);
//   }

//   async exists<T>(entity: new () => T, field: string, value: any) {
//     const repo = this.getRepository(entity);
//     const count = await repo.count({ where: { [field]: value } as any });
//     return count > 0;
//   }

//   getValidFields<T>(entity: new () => T): string[] {
//     const metadata = this.dataSource.getMetadata(entity);
//     return metadata.columns.map((col) => col.propertyName);
//   }

//   fieldExists<T>(entity: new () => T, field: string): boolean {
//     const metadata = this.dataSource.getMetadata(entity);
//     return metadata.columns.some((col) => col.propertyName === field);
//   }

//   /**
//    * Return entity property names including columns and relations.
//    * Useful when validations should consider entity fields (including relations)
//    */
//   getEntityProperties<T>(entity: new () => T): string[] {
//     const metadata = this.dataSource.getMetadata(entity);
//     const cols = metadata.columns.map((col) => col.propertyName);
//     const rels = metadata.relations.map((r) => r.propertyName);
//     return Array.from(new Set([...cols, ...rels]));
//   }

//   async advancedQuery<T>(
//     entity: new () => T,
//     dto: QueryDatabaseDto,
//     alias: string = 'entity',
//   ): Promise<T[]> {
//     const repo = this.getRepository(entity);
//     const query = repo.createQueryBuilder(alias);

//     // SELECT dinámico
//     if (dto.select?.length) {
//       // Validate against entity properties (columns + relations)
//       const validProps = this.getEntityProperties(entity);
//       dto.select.forEach((field) => {
//         if (!validProps.includes(field)) {
//           throw new BadRequestException('Invalid field in select: ' + field);
//         }
//       });

//       // Get metadata to detect relations
//       const metadata = repo.metadata;
//       const relationNames = metadata.relations.map((r) => r.propertyName);

//       // Separate columns and relations
//       const columnFields = dto.select.filter((f) => !relationNames.includes(f));
//       const relationFields = dto.select.filter((f) =>
//         relationNames.includes(f),
//       );

//       // Select only the requested columns
//       if (columnFields.length) {
//         query.select(columnFields.map((f) => `${alias}.${f}`));
//       }

//       // Load relations if they are in select
//       relationFields.forEach((field) => {
//         query.leftJoinAndSelect(`${alias}.${field}`, field);
//       });
//     }

//     // AND conditions
//     if (dto.and?.length) {
//       dto.and.forEach((cond, index) => {
//         const paramKey = `and_${index}`;
//         if (!this.fieldExists(entity, cond.field)) {
//           throw new BadRequestException(
//             'Invalid field in AND condition: ' + cond.field,
//           );
//         }

//         query.andWhere(`${alias}.${cond.field} ${cond.operator} :${paramKey}`, {
//           [paramKey]: cond.value,
//         });
//       });
//     }

//     // OR conditions
//     if (dto.or?.length) {
//       const orExpressions = dto.or.map((cond, index) => {
//         const paramKey = `or_${index}`;
//         if (!this.fieldExists(entity, cond.field)) {
//           throw new BadRequestException(
//             'Invalid field in OR condition: ' + cond.field,
//           );
//         }

//         return `${alias}.${cond.field} ${cond.operator} :${paramKey}`;
//       });

//       const orParams = {};
//       dto.or.forEach((cond, index) => {
//         orParams[`or_${index}`] = cond.value;
//       });

//       query.orWhere(orExpressions.join(' OR '), orParams);
//     }

//     return query.getMany();
//   }

//   async onModuleInit() {
//     console.log('Initializing database connection...');
//     try {
//       if (!this.dataSource.isInitialized) {
//         await this.dataSource.initialize();
//         this.logger.log('Database initialized');
//       }
//     } catch (err) {
//       //this.logger.error('Database initialization failed', err.message);
//       // Lanzar para que Nest termine el arranque o cerrar explícitamente:
//       throw ' Database initialization failed: ';
//     }
//   }
// }
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { QueryDatabaseDto } from './dtos/query-database.dto';
import { DatabaseType } from './database-type.enum';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly maxRetries = 3;
  private readonly initialDelayMs = 1000;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.logger.log('DatabaseService constructor initialized');
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // async onModuleInit() {
  //   this.logger.log('DatabaseService onModuleInit - validating DB connection');
  //   let attempt = 0;
  //   let lastError: any;

  //   while (attempt < this.maxRetries) {
  //     try {
  //       attempt++;
  //       this.logger.log(`Connection attempt ${attempt}/${this.maxRetries}`);

  //       // Validar conexión ejecutando un query simple
  //       await this.dataSource.query('SELECT 1');
  //       this.logger.log('✓ Database connection verified successfully');
  //       return; // Conexión exitosa, continuar
  //     } catch (err) {
  //       lastError = err;
  //       this.logger.warn(
  //         `Attempt ${attempt} failed: ${(err as any)?.message || err}`,
  //       );

  //       if (attempt >= this.maxRetries) {
  //         this.logger.error(
  //           `Database connection failed after ${this.maxRetries} attempts`,
  //           (err as any)?.stack,
  //         );
  //         throw new Error(
  //           // `Unable to connect to database after ${this.maxRetries} attempts: ${(err as any)?.message}`,
  //           `Unable to connect to database.`,
  //         );
  //       }

  //       // Backoff exponencial: 1s, 2s, 4s
  //       const delay = this.initialDelayMs * Math.pow(2, attempt - 1);
  //       this.logger.log(
  //         `Retrying in ${delay}ms before attempt ${attempt + 1}/${this.maxRetries}`,
  //       );
  //       await this.sleep(delay);
  //     }
  //   }
  // }

  async onModuleInit() {
    this.logger.log(
      'DatabaseService onModuleInit - initializing database connection',
    );
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        this.logger.log('Database initialized');
      }
    } catch (err) {
      this.logger.error('Database initialization failed', err.message);
      throw `Unable to connect to database ${err.message}`;
    }
  }

  getRepository<T>(entity: new () => T): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async findAll<T>(entity: new () => T, options = {}) {
    return this.getRepository(entity).find(options);
  }

  async findOne<T>(entity: new () => T, options = {}) {
    return this.getRepository(entity).findOne(options);
  }

  async delete<T>(entity: new () => T, id: any) {
    return this.getRepository(entity).delete(id);
  }

  async exists<T>(entity: new () => T, field: string, value: any) {
    const repo = this.getRepository(entity);
    const count = await repo.count({ where: { [field]: value } as any });
    return count > 0;
  }

  getValidFields<T>(entity: new () => T): string[] {
    const metadata = this.dataSource.getMetadata(entity);
    return metadata.columns.map((col) => col.propertyName);
  }

  fieldExists<T>(entity: new () => T, field: string): boolean {
    const metadata = this.dataSource.getMetadata(entity);
    return metadata.columns.some((col) => col.propertyName === field);
  }

  /**
   * Return entity property names including columns and relations.
   * Useful when validations should consider entity fields (including relations)
   */
  getEntityProperties<T>(entity: new () => T): string[] {
    const metadata = this.dataSource.getMetadata(entity);
    const cols = metadata.columns.map((col) => col.propertyName);
    const rels = metadata.relations.map((r) => r.propertyName);
    return Array.from(new Set([...cols, ...rels]));
  }

  async advancedQuery<T>(
    entity: new () => T,
    dto: QueryDatabaseDto,
    alias: string = 'entity',
  ): Promise<T[]> {
    const repo = this.getRepository(entity);
    const query = repo.createQueryBuilder(alias);

    // SELECT dinámico
    if (dto.select?.length) {
      // Validate against entity properties (columns + relations)
      const validProps = this.getEntityProperties(entity);
      dto.select.forEach((field) => {
        if (!validProps.includes(field)) {
          throw new BadRequestException('Invalid field in select: ' + field);
        }
      });

      // Get metadata to detect relations
      const metadata = repo.metadata;
      const relationNames = metadata.relations.map((r) => r.propertyName);

      // Separate columns and relations
      const columnFields = dto.select.filter((f) => !relationNames.includes(f));
      const relationFields = dto.select.filter((f) =>
        relationNames.includes(f),
      );

      // Select only the requested columns
      if (columnFields.length) {
        query.select(columnFields.map((f) => `${alias}.${f}`));
      }

      // Load relations if they are in select
      relationFields.forEach((field) => {
        query.leftJoinAndSelect(`${alias}.${field}`, field);
      });
    }

    // AND conditions
    if (dto.and?.length) {
      dto.and.forEach((cond, index) => {
        const paramKey = `and_${index}`;
        if (!this.fieldExists(entity, cond.field)) {
          throw new BadRequestException(
            'Invalid field in AND condition: ' + cond.field,
          );
        }

        query.andWhere(`${alias}.${cond.field} ${cond.operator} :${paramKey}`, {
          [paramKey]: cond.value,
        });
      });
    }

    // OR conditions
    if (dto.or?.length) {
      const orExpressions = dto.or.map((cond, index) => {
        const paramKey = `or_${index}`;
        if (!this.fieldExists(entity, cond.field)) {
          throw new BadRequestException(
            'Invalid field in OR condition: ' + cond.field,
          );
        }

        return `${alias}.${cond.field} ${cond.operator} :${paramKey}`;
      });

      const orParams = {};
      dto.or.forEach((cond, index) => {
        orParams[`or_${index}`] = cond.value;
      });

      query.orWhere(orExpressions.join(' OR '), orParams);
    }

    return query.getMany();
  }
}
