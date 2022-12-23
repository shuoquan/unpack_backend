import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from '../service/statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Get('')
  async getStatisticData(
    @Query('uid') auditorId: number,
    @Query('start') startTime: number,
    @Query('end') endTime: number,
  ) {
    return this.statisticService.getStatisticData(startTime, endTime, auditorId);
  }

  @Get('/image')
  async getStatisticImageList(
    @Query('uid') auditorId: number,
    @Query('start') startTime: number,
    @Query('end') endTime: number,
    @Query('p') page: number,
    @Query('ps') pageSize: number,
    @Query('tid') typeId: number,
  ) {
    return this.statisticService.getStatisticImageList(
      startTime,
      endTime,
      page || 0,
      pageSize || 1,
      auditorId || 0,
      typeId || 0,
    );
  }
}
