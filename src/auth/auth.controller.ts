// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterDto {
  username: string;
  password: string;
}

class LoginDto {
  username: string;
  password: string;
}

@Controller('elsyauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}