import { Controller } from '@nestjs/common';
import { Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    console.log('HEADER:', req.headers.authorization);
    console.log('AQUI');
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { username, password, email } = body;
    return this.usersService.create(username, password, email);
  }
}
