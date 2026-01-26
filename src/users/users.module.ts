import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/common-elsy/database/database.service';
import { MailModule } from 'src/common-elsy/mail/mail.module';
import { MailService } from 'src/common-elsy/mail/mail.service';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  providers: [UsersService, DatabaseService, MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
