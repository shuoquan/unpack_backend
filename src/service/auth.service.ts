import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(payload: any): Promise<any> {
    return await this.userService.findOneByUsername(payload.username);
  }
}
