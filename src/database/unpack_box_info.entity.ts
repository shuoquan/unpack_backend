import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum TypeEnum {
  detect = 1,
  review = 2,
}

@Entity('unpack_box_info')
export class UnpackBoxInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'categoryId',
    type: 'int',
    default: 0,
    comment: '安检机返回的categoryId',
  })
  categoryId: number;

  @Index()
  @Column({
    name: 'bag_id',
    type: 'int',
    default: 0,
    comment: '包裹id, 对应bag中id',
  })
  bagId: number;

  @Column({
    name: 'category_name',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'category名称',
  })
  categoryName: string;

  @Column({
    name: 'box',
    type: 'path',
    array: true,
    default: '{}',
    comment: '点位数组(array of path)',
  })
  box: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TypeEnum,
    default: 1,
    comment: '1-识别, 2-判图',
  })
  type: TypeEnum;
}
