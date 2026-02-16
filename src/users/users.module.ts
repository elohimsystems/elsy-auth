import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/common/mail/mail.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsService } from 'src/permission/permission.service';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    RolesModule,
    DatabaseModule,
  ],
  providers: [UsersService, MailService, PermissionsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
