import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType, AccountStatus, Account } from '../database/account.entity';
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
}
