import { Controller } from '@nestjs/common';
import { Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { QueryUsersDto } from './dtos/query-users.dto';
import { SendChangePasswordEmailDto } from './dtos/send-passwordchange-email.dto';
import { ChangePasswordUserDto } from './dtos/changepassword-user.dto';
import { UnlockUserDto } from './dtos/unlock-user.dto';
import { User } from './user.entity';
import { SwaggerCrud } from 'src/common-bussiness/docs/users-docs.decorators';
import { Permission } from 'src/permission/permission.decorator';
import { PermissionsGuard } from 'src/permission/permissions.guard';

// @ApiTags('users')
const UsersSwagger = SwaggerCrud({
  tag: 'Users',
  createDto: RegisterUserDto,
  updateDto: UpdateUserDto,
  entity: User,
});

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsersSwagger.register()
  @Permission('users.register')
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

  // @DocsUsersadvancedSearch()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('users.list')
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

  // @DocsUsersUnlock('Desbloquea un usuario bloqueado')
  @UseGuards(JwtAuthGuard)
  @Post('unlock')
  async Unlock(@Body(new ValidationPipe()) body: UnlockUserDto) {
    return await this.usersService.unlock(body);
  }
}
