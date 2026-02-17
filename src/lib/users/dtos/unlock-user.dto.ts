import { IsString } from 'class-validator';

export class UnlockUserDto {
  @IsString()
  username: string;
}
