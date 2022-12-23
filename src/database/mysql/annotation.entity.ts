import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('annotation')
export class Annotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'image_id', type: 'int', default: 0, comment: '图片id' })
  imageId: number;

  @Index()
  @Column({ name: 'type_id', type: 'varchar', length: 5, default: '0', comment: '类别id' })
  typeId: string;

  @Column({ name: 'type_name', type: 'varchar', length: 30, default: '0', comment: '类别名称' })
  typeName: string;

  @Column({ name: 'x0', type: 'int', default: 0, comment: 'x0' })
  x0: number;

  @Column({ name: 'y0', type: 'int', default: 0, comment: 'y0' })
  y0: number;

  @Column({ name: 'x1', type: 'int', default: 0, comment: 'x1' })
  x1: number;

  @Column({ name: 'y1', type: 'int', default: 0, comment: 'y1' })
  y1: number;

  @Column({ name: 'score', type: 'decimal', default: '0.00', comment: '分数', precision: 5, scale: 2 })
  score: number;

  @Column({ name: 'bag_id', type: 'int', default: 0, comment: '包id' })
  bagId: number;

  @Column({ name: 'check_pts', type: 'varchar', length: 4096, comment: '手绘框坐标' })
  checkPts: string;
}
