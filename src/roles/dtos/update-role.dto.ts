import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
