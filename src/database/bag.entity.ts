import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('bag')
export class Bag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'device',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: '设备名',
  })
  device: string;

  @Column({
    name: 'block_name',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: 'block名',
  })
  blockName: string;

  @Column({
    name: 'block_path',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: 'block服务器存储路径',
  })
  blockPath: string;

  @Column({
    name: 'block_width',
    type: 'int',
    default: 0,
    comment: 'block宽度',
  })
  blockWidth: number;

  @Column({
    name: 'block_height',
    type: 'int',
    default: 0,
    comment: 'block高度',
  })
  blockHeight: number;

  @Column({
    name: 'block_create_at',
    type: 'timestamp with time zone',
    default: '1970-01-01 00:00:00',
    comment: 'block创建时间',
  })
  blockCreateAt: Date;

  @Column({
    name: 'block_id',
    type: 'int',
    default: 0,
    comment: 'x-man服务记录的block id',
  })
  blockId: number;

  @Column({
    name: 'bag_coordinate',
    type: 'box',
    comment: '包裹坐标(左上右下)',
  })
  bagCoordinate: string;

  @Column({
    name: 'video_block_name',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: '视频流包裹名',
  })
  videoBlockName: string;

  @Column({
    name: 'video_block_path',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: '服务器存储视频流包裹路径',
  })
  videoBlockPath: string;

  @Column({
    name: 'video_block_width',
    type: 'int',
    default: 0,
    comment: '视频流包裹宽度',
  })
  videoBlockWidth: number;

  @Column({
    name: 'video_block_height',
    type: 'int',
    default: 0,
    comment: '视频流包裹高度',
  })
  videoBlockHeight: number;

  @Column({
    name: 'create_at',
    type: 'timestamp with time zone',
    default: '1970-01-01 00:00:00',
    comment: '记录创建时间',
  })
  createAt: Date;

  @Column({
    name: 'origin_bag_id',
    type: 'int',
    default: 0,
    comment: '原始包裹id',
  })
  originBagId: number;
}
