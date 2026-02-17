import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/lib/auth/auth.module';
import { MailService } from 'src/lib/common/mail/mail.service';
import { RolesModule } from 'src/lib/roles/roles.module';
import { PermissionsService } from 'src/lib/permission/permission.service';
import { DatabaseModule } from 'src/lib/common/database/database.module';

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
