// users/dto/query-users.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Operator } from 'src/common-elsy/operators.enum';

export class ConditionDto {
  @IsString()
  field: string;

  @IsString()
  @IsEnum(Operator)
  operator: Operator;

  value: any;
}

export class QueryUsersDto {
  @IsOptional()
  @IsArray()
  select?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  and?: ConditionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  or?: ConditionDto[];
}
