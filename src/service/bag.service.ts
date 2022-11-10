import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, In, Repository } from 'typeorm';
import { Bag } from '../database/bag.entity';
import { TypeEnum, UnpackBoxInfo } from '../database/unpack_box_info.entity';
import { BagInfoDto } from '../dto/bagInfo.dto';
import { SocketServerService } from './socketServer.service';

@Injectable()
export class BagService {
  constructor(
    @InjectRepository(Bag)
    private readonly bagRepository: Repository<Bag>,
    @InjectRepository(UnpackBoxInfo)
    private readonly unpackBoxInfoRepository: Repository<UnpackBoxInfo>,
    private readonly socketServerService: SocketServerService,
  ) {}
  async uploadBagInfo(bagInfoDto: BagInfoDto) {
    const {
      device,
      blockName,
      blockPath,
      blockWidth,
      blockHeight,
      blockTimeStamp,
      blockId,
      bagCoordinate,
      videoBlockName,
      videoBlockPath,
      videoBlockHeight,
      videoBlockWidth,
      unpackBoxList,
    } = bagInfoDto;
    if (bagCoordinate.length !== 4)
      throw new HttpException('包裹坐标参数错误', 400);
    const x0 = Math.min(bagCoordinate[0], bagCoordinate[2]);
    const y0 = Math.min(bagCoordinate[1], bagCoordinate[3]);
    const x1 = Math.max(bagCoordinate[0], bagCoordinate[2]);
    const y1 = Math.max(bagCoordinate[1], bagCoordinate[3]);
    await getManager().transaction(async (manager) => {
      const bagInfo = await manager.save(Bag, {
        device,
        blockName,
        blockPath,
        blockWidth,
        blockHeight,
        blockCreateAt: new Date(blockTimeStamp),
        blockId,
        videoBlockHeight,
        videoBlockWidth,
        videoBlockName,
        videoBlockPath,
        createAt: new Date(),
        bagCoordinate: `(${x0 || 0}, ${y0 || 0}),(${x1 || 0}, ${y1 || 0})`,
      });
      if ((unpackBoxList || []).length) {
        await manager.save(
          UnpackBoxInfo,
          unpackBoxList.map((v) => {
            return {
              categoryId: v.categoryId || 0,
              categoryName: v.categoryName || '',
              bagId: bagInfo.id,
              type: v.box.length > 2 ? TypeEnum.review : TypeEnum.detect,
              box: `{"(${v.box.map((point) => `(${point.join(',')})`)})"}`,
            };
          }),
        );
      }
      this.socketServerService.broadcastNewBagId(bagInfo.id);
    });
  }

  // type = 0 找对应的包, type=1 找这个包的后一个, type=-1 找这个包的前一个
  async getBagList(
    bagId: number,
    type = 0,
    pageSize = 1,
    startTime: number,
    endTime: number,
  ) {
    let sql = `select * from bag where 1 = 1`;
    if (bagId && [-1, 0, 1].includes(type)) {
      if (type === -1) {
        sql += ` and id < ${bagId}`;
      } else if (type === 0) {
        sql += ` and id = ${bagId}`;
      } else if (type === 1) {
        sql += ` and id > ${bagId}`;
      }
    }
    let count = 1;
    const params = [];
    if (startTime) {
      sql += ` and block_create_at > $${count}`;
      count += 1;
      params.push(new Date(startTime));
    }
    if (endTime) {
      sql += ` and block_create_at < $${count}`;
      count += 1;
      params.push(new Date(endTime));
    }
    sql += ` order by id limit ${pageSize}`;
    const bagList = await this.bagRepository.query(sql, params);
    const unpackBoxInfoList = bagList.length
      ? await this.unpackBoxInfoRepository.find({
          where: {
            bagId: In(bagList.map((v) => v.id)),
          },
        })
      : [];
    const unpackBoxInfoMap = unpackBoxInfoList.reduce((pre, cur) => {
      if (!pre[cur.bagId]) pre[cur.bagId] = [];
      pre[cur.bagId].push(cur);
      return pre;
    }, {});
    return bagList.map((v) => {
      return {
        ...v,
        type,
        unpackBoxInfoList: unpackBoxInfoMap[v.id],
      };
    });
  }
}
