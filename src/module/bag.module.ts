import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnpackBoxInfo } from '../database/postgresql/unpack_box_info.entity';
import { Bag } from '../database/postgresql/bag.entity';
import { BagService } from '../service/bag.service';
import { BagController } from '../controller/bag.controller';
import { SocketModule } from './socket.module';
import { UnpackRecordInfo } from '../database/postgresql/unpack_record_info.entity';
import { Account } from '../database/postgresql/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Bag, UnpackBoxInfo, UnpackRecordInfo]), SocketModule],
  providers: [BagService],
  exports: [BagService],
  controllers: [BagController],
})
export class BagModule {}
