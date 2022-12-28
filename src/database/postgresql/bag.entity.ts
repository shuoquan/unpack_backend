import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum BagStatus {
  initial = 0, // 初始状态
  noUnpack = 1, // 放行
  needUnpack = 2, // 已登记
}
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

  @Column({
    name: 'unpack_record_at',
    type: 'timestamp with time zone',
    default: '1970-01-01 00:00:00',
    comment: '开包信息记录时间',
  })
  unpackRecordAt: Date;

  @Column({
    name: 'unpack_auditor_id',
    type: 'int',
    default: 0,
    comment: '开包员id',
  })
  unpackAuditorId: number;

  @Column({
    name: 'unpack_auditor_name',
    type: 'varchar',
    length: 16,
    default: '',
    comment: '开包员姓名',
  })
  unpackAuditorName: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: BagStatus,
    default: 0,
    comment: '包状态',
  })
  status: BagStatus;

  @Column({
    name: 'bag_user_pic',
    type: 'varchar',
    length: 1024,
    default: '',
    comment: '包裹用户图片存储路径',
  })
  bagUserPic: string;

  @Column({
    name: 'bag_user_name',
    type: 'varchar',
    length: 16,
    default: '',
    comment: '包裹所属用户姓名',
  })
  bagUserName: string;

  @Column({
    name: 'bag_user_phone',
    type: 'varchar',
    length: 16,
    default: '',
    comment: '包裹所属用户手机号',
  })
  bagUserPhone: string;

  @Column({
    name: 'review_auditor_id',
    type: 'int',
    default: 0,
    comment: '判图员id',
  })
  reviewAuditorId: number;

  @Column({
    name: 'auditor_name',
    type: 'varchar',
    length: 16,
    default: '',
    comment: '判图员姓名',
  })
  auditorName: string;
}
