import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('unpack_record_info')
export class UnpackRecordInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'category_id',
    type: 'int',
    default: 0,
    comment: '开包员登记的categoryId',
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
    name: 'contraband_pic',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: '违禁品图片路径',
  })
  contrabandPic: string;
}
