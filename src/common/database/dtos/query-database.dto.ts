// users/dto/query-users.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Operator } from 'src/common/operators.enum';

export class ConditionDto {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsEnum(Operator)
  @IsNotEmpty()
  operator: Operator;

  @IsNotEmpty()
  value: any;
}

export class QueryDatabaseDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
