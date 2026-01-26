// database/database.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  getRepository<T>(entity: new () => T): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async findAll<T>(entity: new () => T, options = {}) {
    return this.getRepository(entity).find(options);
  }

  async findOne<T>(entity: new () => T, options = {}) {
    return this.getRepository(entity).findOne(options);
  }

  //   async create<T>(entity: new () => T, data: Partial<T>) {
  //     const repo = this.getRepository(entity);
  //     const instance = repo.create(data);
  //     return repo.save(instance);
  //   }

  //   async update<T>(entity: new () => T, id: any, data: Partial<T>) {
  //     const repo = this.getRepository(entity);
  //     await repo.update(id, data);
  //     return repo.findOne({ where: { id } as any });
  //   }

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
}
