import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Auth } from './auth/entities/auth.entity';
import { EventAuth } from './auth/entities/eventauth.entity';
import { MailModule } from './common-elsy/mail/mail.module';
import { Route } from './routes/route.entity';
import { DataTable } from './roles/datatable.entity';
import { Role } from './roles/role.entity';
import { PermissionsService } from './permission/permission.service';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Auth, EventAuth, Role, DataTable, Route],
      synchronize: true,
      // logging: true, // 👈 aquí
    }),
    AuthModule,
    RoutesModule,
    UsersModule,
    MailModule,
    RoutesModule,
  ],
  providers: [PermissionsService],
})
export class AppModule {}
