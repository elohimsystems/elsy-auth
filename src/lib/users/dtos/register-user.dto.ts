import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsStrongPassword()
  @MinLength(12)
  password: string;

  @IsEmail()
  email: string;
}
