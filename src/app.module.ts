import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Auth } from './auth/entities/auth.entity';
import { EventAuth } from './auth/entities/eventauth.entity';
import { MailModule } from './common/mail/mail.module';
import { Route } from './routes/route.entity';
import { DataTable } from './roles/datatable.entity';
import { Role } from './roles/role.entity';
import { PermissionsService } from './permission/permission.service';
import { RoutesModule } from './routes/routes.module';
import { DatabaseModule } from './common/database/database.module';

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
