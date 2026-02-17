import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './lib/auth/auth.module';
import { User } from './lib/users/user.entity';
import { UsersModule } from './lib/users/users.module';
import { Auth } from './lib/auth/entities/auth.entity';
import { EventAuth } from './lib/auth/entities/eventauth.entity';
import { MailModule } from './lib/common/mail/mail.module';
import { Route } from './lib/routes/route.entity';
import { DataTable } from './lib/roles/datatable.entity';
import { Role } from './lib/roles/role.entity';
import { PermissionsService } from './lib/permission/permission.service';
import { RoutesModule } from './lib/routes/routes.module';
import { DatabaseModule } from './lib/common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    RoutesModule,
    UsersModule,
    MailModule,
    RoutesModule,
  ],
  providers: [PermissionsService],
})
export class AppModule {}
