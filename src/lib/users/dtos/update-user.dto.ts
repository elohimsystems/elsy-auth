import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { IsNonSpacesString } from 'src/lib/common/validators/is-non-empty-string.validator';

export class UpdateUserDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNonSpacesString()
  username: string;

  @IsStrongPassword()
  @IsOptional()
  @MinLength(12)
  password: string;

  @IsBoolean()
  @IsOptional()
  isactive: boolean;

  @IsEmail()
  @IsOptional()
  email: string;
}
