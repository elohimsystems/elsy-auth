import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Or } from 'typeorm';

export function DocsUsersList() {
  return applyDecorators(
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
  );
}

export function DocsUsersCreate(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Operación exitosa' }),
    ApiResponse({ status: 401, description: 'Token inválido o expirado' }),
  );
}
