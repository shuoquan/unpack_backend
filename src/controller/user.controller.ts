import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    return await this.userService.login(username, password);
  }
}
