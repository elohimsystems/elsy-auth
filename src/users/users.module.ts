import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/common-elsy/database/database.service';
import { MailService } from 'src/common-elsy/mail/mail.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsService } from 'src/permission/permission.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    RolesModule,
  ],
  providers: [UsersService, DatabaseService, MailService, PermissionsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
