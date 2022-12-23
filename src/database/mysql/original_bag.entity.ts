import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('bag')
export class OriginalBag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'box', type: 'varchar', length: 512, nullable: false, comment: 'bag相对block坐标' })
  box: string;

  @Column({ name: 'user_check', type: 'int', default: 0, comment: '0-未开包,1-开包' })
  userCheck: number;

  @Column({ name: 'xman_check', type: 'int', default: 0, comment: 'xman自动选中, 0-未选中,1-选中' })
  xmanCheck: number;

  @Column({ name: 'bid', type: 'int', default: 0, comment: 'block内包id，从0开始' })
  bid: number;

  @Column({ name: 'image_id', type: 'int', default: 0, comment: '关联image表id' })
  imageId: number;

  @Column({ name: 'mark', type: 'int', default: 0, comment: '是否收藏, 0-未收藏,1-收藏' })
  mark: number;

  @Column({ name: 'user', type: 'int', default: 0, comment: '判图员id' })
  uid: number;

  @Column({ name: 'danger', type: 'int', default: 0, comment: '是否有违禁品,-1-不确定,0-没有,1-有' })
  danger: number;
}
