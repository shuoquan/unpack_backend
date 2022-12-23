import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType, AccountStatus, Account, PlatformType } from '../database/postgresql/account.entity';
import { Repository } from 'typeorm';
import { CryptoService } from './crypto.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly logger = new Logger('user');

  constructor(
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userName: string, password: string) {
    const user = await this.userRepository.findOne({ username: userName });
    if (!user || user.status !== AccountStatus.passed) throw new HttpException('用户不存在', 403);
    password = this.cryptoService.md5(password);
    if (user.password !== password) throw new HttpException('密码错误', 403);
    const payload = {
      userId: user.id,
      roleId: user.roleId,
      username: user.username,
      platformId: user.platformId,
      // mobile: user.mobile,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '12h',
    });
    return {
      user: payload,
      token,
    };
  }

  async findOneByUsername(username: string): Promise<Account | undefined> {
    return await this.userRepository.findOne({ username });
  }

  async getUserList(page = 0, pageSize = 1) {
    if (page < 0 || pageSize <= 0) throw new HttpException('参数错误', 403);
    return this.userRepository.find({
      select: ['id', 'username'],
      where: {
        status: AccountStatus.passed,
        platformId: PlatformType.audit,
      },
      skip: page * pageSize,
      take: pageSize,
    });
  }
}
