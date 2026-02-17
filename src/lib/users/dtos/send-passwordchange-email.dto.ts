import { IsEmail } from 'class-validator';

export class SendChangePasswordEmailDto {
  @IsEmail()
  email: string;
}
