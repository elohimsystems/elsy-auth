import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

interface CrudSwaggerOptions {
  tag: string;
  createDto?: Type<any>;
  updateDto?: Type<any>;
  entity?: Type<any>;
}

export function SwaggerCrud(options: CrudSwaggerOptions) {
  const { tag, createDto, updateDto, entity } = options;

  return {
    register: () =>
      applyDecorators(
        ApiTags(tag),
        ApiOperation({ summary: `Registrar ${tag}` }),
        ApiBody({ type: createDto }),
        ApiResponse({
          status: 201,
          description: `${tag} creado correctamente`,
          type: entity,
        }),
        ApiResponse({ status: 400, description: 'Datos inválidos' }),
      ),

    findAll: () =>
      applyDecorators(
        ApiTags(tag),
        ApiOperation({ summary: `Listar ${tag}` }),
        ApiResponse({
          status: 200,
          description: `Lista de ${tag}`,
          type: entity,
          isArray: true,
        }),
      ),

    findOne: () =>
      applyDecorators(
        ApiTags(tag),
        ApiOperation({ summary: `Obtener ${tag} por ID` }),
        ApiParam({ name: 'id', type: String }),
        ApiResponse({
          status: 200,
          description: `${tag} encontrado`,
          type: entity,
        }),
        ApiResponse({ status: 404, description: `${tag} no encontrado` }),
      ),

    update: () =>
      applyDecorators(
        ApiTags(tag),
        ApiOperation({ summary: `Actualizar ${tag}` }),
        ApiParam({ name: 'id', type: String }),
        ApiBody({ type: updateDto }),
        ApiResponse({
          status: 200,
          description: `${tag} actualizado`,
          type: entity,
        }),
        ApiResponse({ status: 404, description: `${tag} no encontrado` }),
      ),

    remove: () =>
      applyDecorators(
        ApiTags(tag),
        ApiOperation({ summary: `Eliminar ${tag}` }),
        ApiParam({ name: 'id', type: String }),
        ApiResponse({ status: 200, description: `${tag} eliminado` }),
        ApiResponse({ status: 404, description: `${tag} no encontrado` }),
      ),

    advancedSearch: () =>
      applyDecorators(
        ApiTags(tag),
        ApiOperation({
          summary: 'Lista los usarios con filtros avanzados si se desea.',
          description: `
        Permite listar los usuarios aplicando filtros avanzados utilizando operadores lógicos AND y OR.
        `,
        }),
        ApiBody({
          description: 'Filtros avanzados para la búsqueda de usuarios',
          type: 'AdvancedFilterDto',
          schema: {
            example: {
              AndExample: {
                And: [
                  { field: 'role', op: '=', value: 'admin' },
                  { field: 'isActive', op: '=', value: true },
                ],
              },
              OrExample: {
                or: [
                  { field: 'email', op: 'LIKE', value: '%@example.com' },
                  { field: 'username', op: 'LIKE', value: 'user%' },
                ],
              },
            },
          },
        }),
        ApiResponse({
          status: 200,
          description: 'Operación exitosa',
          schema: {
            example: [
              {
                id: 1,
                username: 'user123',
                password: 'securePass!23',
              },
              {
                id: 2,
                username: 'user258',
                password: '*********',
              },
            ],
          },
        }),
      ),
  };
}
