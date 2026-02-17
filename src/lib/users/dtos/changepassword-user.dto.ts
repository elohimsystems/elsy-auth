import {
  IsEmail,
  IsInt,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class ChangePasswordUserDto {
  @IsInt()
  id: number;

  @IsStrongPassword()
  @MinLength(12)
  password: string;
}
