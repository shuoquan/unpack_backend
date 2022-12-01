import {
  IsString,
  IsNotEmpty,
  IsArray,
  MinLength,
  MaxLength,
  IsNumber,
  Validate,
  Min,
  IsDate,
  ArrayNotEmpty,
} from 'class-validator';
import { UnpackBoxInfo } from '../interface/unpackBoxInfo.interface';
// import { TaskSalaryValidation } from '../validation/taskSalary.validation';
// import { TaskSalary } from '../interface/taskSalary.interface';
export class BagInfoDto {
  @IsString()
  readonly device = '';

  @IsNotEmpty({ message: 'block name不能为空' })
  readonly blockName: string;

  @IsNotEmpty({ message: 'block path不能为空' })
  readonly blockPath: string;

  @IsNumber()
  @Min(0, { message: 'block width不能小于0' })
  readonly blockWidth: number;

  @IsNumber()
  @Min(0, { message: 'block height不能小于0' })
  readonly blockHeight: number;

  readonly blockId = 0;

  @IsNumber()
  @IsNotEmpty({ message: 'block时间戳不能为空' })
  readonly blockTimeStamp: number;

  @IsString()
  readonly videoBlockName = '';

  @IsString()
  readonly videoBlockPath = '';

  @IsNumber()
  readonly videoBlockWidth = 0;

  @IsNumber()
  readonly videoBlockHeight = 0;

  @IsArray()
  @ArrayNotEmpty({ message: '包裹坐标不能为空' })
  readonly bagCoordinate: number[];

  @IsArray()
  readonly unpackBoxList: UnpackBoxInfo[] = [];

  @IsNumber()
  readonly bagId = 0;
}
