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

  @IsNotEmpty({ message: 'videoBlockName不能为空' })
  readonly videoBlockName: string;

  @IsNotEmpty({ message: 'videoBlockPath不能为空' })
  readonly videoBlockPath: string;

  @IsNumber()
  @Min(0, { message: 'videoBlockWidth不能小于0' })
  readonly videoBlockWidth: number;

  @IsNumber()
  @Min(0, { message: 'videoBlockHeight不能小于0' })
  readonly videoBlockHeight: number;

  @IsArray()
  @ArrayNotEmpty({ message: '包裹坐标不能为空' })
  readonly bagCoordinate: number[];

  @IsArray()
  readonly unpackBoxList: UnpackBoxInfo[] = [];
}
