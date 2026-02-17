// Exportar módulos principales
export * from './lib/auth/auth.module';
export * from './lib/common/database/database.module';
export * from './lib/common/mail/mail.module';
export * from './lib/roles/roles.module';
export * from './lib/routes/routes.module';
export * from './lib/users/users.module';

// Exportar servicios
export * from './lib/auth/auth.service';
export * from './lib/common/database/database.service';
export * from './lib/common/mail/mail.service';
export * from './lib/permission/permission.service';
export * from './lib/roles/roles.service';
export * from './lib/routes/routes.service';
export * from './lib/users/users.service';

// Exportar DTOs
export * from './lib/auth/dtos/login.dto';
export * from './lib/common/database/dtos/query-database.dto';
export * from './lib/roles/dtos/create-role.dto';
export * from './lib/roles/dtos/query-role.dto';
export * from './lib/roles/dtos/update-role.dto';
export * from './lib/routes/dtos/query-route.dto';
export * from './lib/users/dtos/assign-roles.dto';
export * from './lib/users/dtos/changepassword-user.dto';
export * from './lib/users/dtos/query-users.dto';
export * from './lib/users/dtos/register-user.dto';
export * from './lib/users/dtos/send-passwordchange-email.dto';
export * from './lib/users/dtos/unlock-user.dto';
export * from './lib/users/dtos/update-user.dto';

// Exportar entidades
export * from './lib/auth/entities/eventauth.entity';
export * from './lib/auth/entities/auth.entity';
export * from './lib/roles/datatable.entity';
export * from './lib/roles/role.entity';
export * from './lib/routes/route.entity';
export * from './lib/users/user.entity';

// Exportar guards, decorators
export * from './lib/auth/jwt-auth.guard';
export * from './lib/permission/permission.decorator';
export * from './lib/permission/permissions.guard';
