import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, default: '', comment: '图片名称' })
  name: string;

  @Column({ name: 'path', type: 'varchar', length: 300, default: '', comment: '图片路径' })
  path: string;

  @Column({ name: 'url', type: 'varchar', length: 300, default: '', comment: '图片网络url' })
  url: string;

  @Column({ name: 'zkx_url', type: 'varchar', length: 300, default: '', comment: 'zkx_url' })
  zkxUrl: string;

  @Column({ name: 'width', type: 'bigint', default: 0, comment: '图片宽度' })
  width: number;

  @Column({ name: 'height', type: 'int', default: 0, comment: '图片高度' })
  height: number;

  @Index()
  @Column({ name: 'time', type: 'bigint', default: 0, comment: '创建时间' })
  time: number;

  @Column({ name: 'score', type: 'int', default: 0, comment: '图片分数' })
  score: number;

  @Column({
    name: 'upload_failed_time',
    type: 'bigint',
    default: 0,
    comment: '上传失败的时间,失败一段时间后才会再次尝试上传',
  })
  uploadFailedTime: number;

  @Column({ name: 'status', type: 'int', default: 0, comment: '图片状态, 0-正常 1-已上传' })
  status: number;

  @Column({ name: 'upload_cnt', type: 'tinyint', default: 0, comment: '上传次数,超过3次不再重传' })
  uploadCnt: number;

  @Column({
    name: 'upload_status',
    type: 'int',
    default: 0,
    comment: '上传情况,二进制  0x00. 未上传  0x01. 上传图片  0x02. 上传anno  0x04. 上传zkx',
  })
  uploadStatus: number;
}
