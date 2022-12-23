import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticService } from '../service/statistic.service';
import { StatisticController } from '../controller/statistic.controller';
import { Bag } from '../database/postgresql/bag.entity';
import { Annotation } from '../database/mysql/annotation.entity';
import { Image } from '../database/mysql/image.entity';
import { UnpackRecordInfo } from '../database/postgresql/unpack_record_info.entity';
import { UnpackBoxInfo } from '../database/postgresql/unpack_box_info.entity';
import { OriginalBag } from '../database/mysql/original_bag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bag, UnpackRecordInfo, UnpackBoxInfo]),
    TypeOrmModule.forFeature([Image, Annotation, OriginalBag], 'mysql'),
  ],
  providers: [StatisticService],
  exports: [StatisticService],
  controllers: [StatisticController],
})
export class StatisticModule {}
