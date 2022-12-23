import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum AccountStatus {
  initial = 0,
  deleted = 1,
  passed = 2,
}

export enum RoleType {
  default = 0,
  other = 1,
}

export enum PlatformType {
  unpack = 0, // 开包台
  audit = 1, // 判图台
}

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '用户名',
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    default: '',
    comment: '密码',
  })
  password: string;

  @Column({
    name: 'mobile',
    type: 'varchar',
    length: 20,
    default: '',
    unique: true,
    comment: '手机号',
  })
  mobile: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AccountStatus,
    default: 2,
    comment: '状态',
  })
  status: AccountStatus;

  // 1.默认  2.其他
  @Column({ name: 'role_id', type: 'enum', enum: RoleType, default: 0, comment: '角色类型' })
  roleId: RoleType;

  @Column({ name: 'platform_id', type: 'enum', enum: PlatformType, default: 0, comment: '平台id' })
  platformId: PlatformType;
}
