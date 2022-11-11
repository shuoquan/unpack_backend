import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BagService } from '../service/bag.service';
import { BagInfoDto } from '../dto/bagInfo.dto';

@Controller('bag')
export class BagController {
  constructor(private readonly bagService: BagService) {}

  // 上报包图关联信息
  @Post('/')
  async uploadBagInfo(@Body('') bagInfoDto: BagInfoDto) {
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
  ) {
    return this.bagService.getBagList(bagId, type || 0, pageSize || 1, startTime, endTime, order);
  }
}
