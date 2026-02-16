import { IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class AssignRolesDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
