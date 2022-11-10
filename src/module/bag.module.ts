import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnpackBoxInfo } from '../database/unpack_box_info.entity';
import { Bag } from '../database/bag.entity';
import { BagService } from '../service/bag.service';
import { BagController } from '../controller/bag.controller';
import { SocketModule } from './socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bag, UnpackBoxInfo]), SocketModule],
  providers: [BagService],
  exports: [BagService],
  controllers: [BagController],
})
export class BagModule {}
