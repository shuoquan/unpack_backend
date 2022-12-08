import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnpackBoxInfo } from '../database/unpack_box_info.entity';
import { Bag } from '../database/bag.entity';
import { BagService } from '../service/bag.service';
import { BagController } from '../controller/bag.controller';
import { SocketModule } from './socket.module';
import { UnpackRecordInfo } from '../database/unpack_record_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bag, UnpackBoxInfo, UnpackRecordInfo]), SocketModule],
  providers: [BagService],
  exports: [BagService],
  controllers: [BagController],
})
export class BagModule {}
