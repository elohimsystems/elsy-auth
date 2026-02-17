// import { Type } from 'class-transformer';
// import {
//   IsArray,
//   IsOptional,
//   IsString,
//   ValidateNested,
//   IsNotEmpty,
//   IsEnum,
// } from 'class-validator';
import { QueryDatabaseDto } from 'src/lib/common/database/dtos/query-database.dto';
// import { Operator } from 'src/common/operators.enum';

// export class ConditionDto {
//   @IsString()
//   @IsNotEmpty()
//   field: string;

//   @IsEnum(Operator)
//   @IsNotEmpty()
//   operator: Operator;

//   @IsNotEmpty()
//   value: any;
// }

export class QueryUsersDto extends QueryDatabaseDto {
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // select?: string[];
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ConditionDto)
  // and?: ConditionDto[];
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ConditionDto)
  // or?: ConditionDto[];
}
