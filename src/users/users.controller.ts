import { Controller } from '@nestjs/common';
import { Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DocsUsersadvancedSearch,
  DocsUsersUnlock,
} from 'src/common-bussiness/docs/user-docs-list.decorators';
import { QueryUsersDto } from './dtos/query-users.dto';
import { SendChangePasswordEmailDto } from './dtos/send-passwordchange-email.dto';
import { ChangePasswordUserDto } from './dtos/changepassword-user.dto';
import { UnlockUserDto } from './dtos/unlock-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body(new ValidationPipe()) body: RegisterUserDto) {
    const { username, password, email } = body;
    return await this.usersService.create(username, password, email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@Body(new ValidationPipe()) body: UpdateUserDto) {
    return await this.usersService.update(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deactivate')
  async deactivate(@Body(new ValidationPipe()) body: { userId: number }) {
    return await this.usersService.deactivate(body.userId);
  }

  @DocsUsersadvancedSearch()
  @UseGuards(JwtAuthGuard)
  @Post('query')
  async advancedSearch(@Body(new ValidationPipe()) filters: QueryUsersDto) {
    return await this.usersService.advancedQuery(filters);
  }

  //@DocsUsersList()
  @UseGuards(JwtAuthGuard)
  @Post('sendchangepasswordemail')
  async sendChangePasswordEmail(
    @Body(new ValidationPipe()) body: SendChangePasswordEmailDto,
  ) {
    return await this.usersService.sendPasswordChangeEmail(body);
  }

  // @DocsUsersList()
  @UseGuards(JwtAuthGuard)
  @Post('changepassword')
  async ChangePassword(
    @Body(new ValidationPipe()) body: ChangePasswordUserDto,
  ) {
    return await this.usersService.changePassword(body);
  }

  @DocsUsersUnlock('Desbloquea un usuario bloqueado')
  @UseGuards(JwtAuthGuard)
  @Post('unlock')
  async Unlock(@Body(new ValidationPipe()) body: UnlockUserDto) {
    return await this.usersService.unlock(body);
  }
}
