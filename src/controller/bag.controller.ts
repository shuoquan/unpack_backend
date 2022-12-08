import { Body, Controller, Get, Logger, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BagService } from '../service/bag.service';
import { BagInfoDto } from '../dto/bagInfo.dto';
import { AuthGuard } from '@nestjs/passport';
import { BagRegisterInfoDto } from '../dto/bagRegisterInfo.dto';
import { UserDecorator } from '../decorator/user.decorator';
import { Account } from '../database/account.entity';

@Controller('bag')
export class BagController {
  private readonly logger = new Logger('bagController');
  constructor(private readonly bagService: BagService) {}

  // 上报包图关联信息
  @Post('/')
  async uploadBagInfo(@Body('') bagInfoDto: BagInfoDto) {
    this.logger.log(JSON.stringify(bagInfoDto), '上报包信息');
    return this.bagService.uploadBagInfo(bagInfoDto);
  }

  // 获取包信息
  @Get('/')
  async getBagList(
    @Query('id') bagId: number,
    @Query('type') type: number,
    @Query('ps') pageSize: number,
    @Query('start') startTime: number,
    @Query('end') endTime: number,
    @Query('order') order: number,
    @Query('cat') cat: string,
    @Query('user') user: string,
    @Query('auditor') auditor: string,
    @Query('status') status: number,
  ) {
    return this.bagService.getBagList(
      bagId,
      type || 0,
      pageSize || 1,
      startTime,
      endTime,
      order,
      cat,
      user,
      auditor,
      status,
    );
  }

  // 上报开包登记信息
  @UseGuards(AuthGuard('jwt'))
  @Post('/register')
  async uploadBagRegisterInfo(
    @Body('bagUserPic') bagUserPic,
    @Body('') bagRegisterInfoDto: BagRegisterInfoDto,
    @UserDecorator() user: Account,
  ) {
    // this.logger.log(JSON.stringify(bagRegisterInfoDto), '上报开包登记信息');
    // console.log(bagRegisterInfoDto, bagUserPic);
    return this.bagService.uploadBagRegisterInfo(bagRegisterInfoDto, user, bagUserPic);
  }
}
