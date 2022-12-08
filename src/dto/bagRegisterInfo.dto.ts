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
  IsIn,
} from 'class-validator';
import { UnpackCategoryInfo } from '../interface/unpackCategoryInfo.interface';
import { Any } from 'typeorm';

export class BagRegisterInfoDto {
  @IsNumber()
  @Min(0, { message: 'bagId不能小于0' })
  readonly bagId: number;

  @IsString()
  readonly bagUserName = '';

  @IsString()
  readonly bagUserPhone = '';

  // bagUserPic: object;

  @IsArray()
  readonly unpackCategoryList: UnpackCategoryInfo[] = [];

  @IsIn([1, 2], { message: '开包状态参数错误' })
  readonly status: number;
}
