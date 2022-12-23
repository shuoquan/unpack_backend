import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, In, Repository } from 'typeorm';
import { Bag, BagStatus } from '../database/postgresql/bag.entity';
import { TypeEnum, UnpackBoxInfo } from '../database/postgresql/unpack_box_info.entity';
import { BagInfoDto } from '../dto/bagInfo.dto';
import { SocketServerService } from './socketServer.service';
import { BagRegisterInfoDto } from '../dto/bagRegisterInfo.dto';
import { Account } from '../database/postgresql/account.entity';
import { UnpackRecordInfo } from '../database/postgresql/unpack_record_info.entity';
import * as fs from 'fs';
import * as moment from 'moment';

@Injectable()
export class BagService {
  constructor(
    @InjectRepository(Bag)
    private readonly bagRepository: Repository<Bag>,
    @InjectRepository(UnpackBoxInfo)
    private readonly unpackBoxInfoRepository: Repository<UnpackBoxInfo>,
    @InjectRepository(UnpackRecordInfo)
    private readonly unpackRecordInfoRepository: Repository<UnpackRecordInfo>,
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
      bagId,
      auditorId,
    } = bagInfoDto;
    if (blockTimeStamp.toString().length !== 13) throw new HttpException('blockTimeStamp参数错误(长度不为13)', 400);
    if (bagCoordinate.length !== 4) throw new HttpException('包裹坐标参数错误', 400);
    const x0 = Math.min(bagCoordinate[0], bagCoordinate[2]);
    const y0 = Math.min(bagCoordinate[1], bagCoordinate[3]);
    const x1 = Math.max(bagCoordinate[0], bagCoordinate[2]);
    const y1 = Math.max(bagCoordinate[1], bagCoordinate[3]);
    await getManager().transaction(async manager => {
      const existBagInfo = await manager.findOne(Bag, {
        originBagId: bagId,
        blockName,
      });
      if (existBagInfo) {
        await manager.update(
          Bag,
          {
            id: existBagInfo.id,
          },
          {
            videoBlockName,
            videoBlockPath,
            videoBlockHeight,
            videoBlockWidth,
          },
        );
        this.socketServerService.broadcastNewBagId(existBagInfo.id);
      } else {
        const bagInfo = await manager.save(Bag, {
          device,
          blockName,
          blockPath,
          blockWidth,
          blockHeight,
          videoBlockName: videoBlockName || '',
          videoBlockPath: videoBlockPath || '',
          videoBlockHeight: (videoBlockHeight || 0) <= 0 ? 0 : videoBlockHeight,
          videoBlockWidth: (videoBlockWidth || 0) <= 0 ? 0 : videoBlockWidth,
          blockCreateAt: new Date(blockTimeStamp),
          blockId,
          createAt: new Date(),
          bagCoordinate: `(${x0 || 0}, ${y0 || 0}),(${x1 || 0}, ${y1 || 0})`,
          originBagId: bagId,
          reviewAuditorId: auditorId,
        });
        if ((unpackBoxList || []).length) {
          await manager.save(
            UnpackBoxInfo,
            unpackBoxList.map(v => {
              return {
                categoryId: v.categoryId || 0,
                categoryName: v.categoryName || '',
                bagId: bagInfo.id,
                type: v.box.length > 2 ? TypeEnum.review : TypeEnum.detect,
                box: `{"(${v.box.map(point => `(${point.join(',')})`)})"}`,
              };
            }),
          );
        }
        this.socketServerService.broadcastNewBagId(bagInfo.id);
      }
    });
  }

  // type = 0 找对应的包, type=1 找这个包的后一个, type=-1 找这个包的前一个
  // order = -1 倒序
  async getBagList(
    bagId: number,
    type = 0,
    pageSize = 1,
    startTime: number,
    endTime: number,
    order = -1,
    cat = '',
    user = '',
    auditor = '',
    status = -1,
  ) {
    let sql = ``;
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
    // todo sql 注入检测
    if (user) {
      sql += ` and bag_user_name like '%${user}%'`;
    }
    if (auditor) {
      sql += ` and unpack_auditor_name like '%${auditor}%'`;
    }
    if (cat) {
      sql += ` and id in (select bag_id from unpack_record_info where category_name like '%${cat}%')`;
    }
    if (!isNaN(status) && status !== -1) {
      sql += ` and status = $${count}`;
      count += 1;
      params.push(status);
    }
    const minBagId = await this.bagRepository.query(`select min(id) from bag where block_create_at > $1`, [
      startTime ? new Date(startTime) : new Date(new Date().toLocaleDateString()),
    ]);
    sql += ` order by id ${order === -1 ? 'DESC' : 'ASC'} limit ${pageSize}`;
    const bagList = await this.bagRepository.query('select * from bag where 1 = 1 ' + sql, params);
    const [unpackBoxInfoList, unpackRecordList] = bagList.length
      ? await Promise.all([
          this.unpackBoxInfoRepository.find({
            where: {
              bagId: In(bagList.map(v => v.id)),
            },
          }),
          this.unpackRecordInfoRepository.find({
            where: {
              bagId: In(bagList.map(v => v.id)),
            },
          }),
        ])
      : [[], []];
    const unpackBoxInfoMap = unpackBoxInfoList.reduce((pre, cur) => {
      if (!pre[cur.bagId]) pre[cur.bagId] = [];
      pre[cur.bagId].push(cur);
      return pre;
    }, {});
    const unpackRecordInfoMap = unpackRecordList.reduce((pre, cur) => {
      if (!pre[cur.bagId]) pre[cur.bagId] = [];
      pre[cur.bagId].push(cur);
      return pre;
    }, {});
    return bagList.map(v => {
      return {
        ...v,
        type,
        unpackBoxInfoList: unpackBoxInfoMap[v.id] || [],
        unpackRecordList: unpackRecordInfoMap[v.id] || [],
        minIndex: minBagId[0].min || 0,
      };
    });
  }

  async uploadBagRegisterInfo(
    status: number,
    bagId: number,
    bagUserPhone = '',
    bagUserName = '',
    unpackCategoryListInfo = '[]',
    user: Account,
    bagUserPic: any,
  ) {
    // const { status, bagId, bagUserPhone, bagUserName, unpackCategoryListInfo } = bagRegisterInfoDto;
    const unpackCategoryList = JSON.parse(unpackCategoryListInfo);
    const bagInfo = await this.bagRepository.findOne({ id: bagId });
    if (!bagInfo || bagInfo.status !== BagStatus.initial) throw new HttpException('包裹不存在', 400);
    // todo 图片上传的是二进制数据，需要转存到服务器
    const pathList = ['core', 'unpack', 'images', `${bagInfo.device}`];
    let serverPath = '';
    for (const path of pathList) {
      serverPath += `/${path}`;
      if (!fs.existsSync(serverPath)) fs.mkdirSync(serverPath);
    }
    if (!fs.existsSync(serverPath + '/user')) fs.mkdirSync(serverPath + '/user');
    if (!fs.existsSync(serverPath + '/contraband')) fs.mkdirSync(serverPath + '/contraband');
    const time = moment().format('YYYYMMDDHHmmss');
    const userPicPath = `${serverPath}/user/${time}.jpg`;
    const contractPicPath = `${serverPath}/contraband`;
    if (bagUserPic && bagUserPic.length) {
      fs.writeFileSync(userPicPath, Buffer.from(bagUserPic, 'base64'));
    }
    await this.bagRepository.update(
      { id: bagId },
      {
        bagUserPhone,
        bagUserPic: userPicPath,
        bagUserName,
        unpackAuditorId: user.id,
        unpackRecordAt: new Date(),
        status,
        unpackAuditorName: user.username,
      },
    );
    if (status === 2) {
      const existUnpackRecord = await this.unpackRecordInfoRepository.findOne({ bagId });
      // todo 同上，图片上传的是二进制数据，需要转存到服务器
      if (!existUnpackRecord && unpackCategoryList.length) {
        const saveUnpackRecordList = [];
        for (let i = 0; i < unpackCategoryList.length; i++) {
          const unpackCategory = unpackCategoryList[i];
          fs.writeFileSync(
            `${contractPicPath}/${time}_${i + 1}.jpg`,
            Buffer.from(unpackCategory.contrabandPic, 'base64'),
          );
          saveUnpackRecordList.push({
            bagId,
            categoryName: unpackCategory.categoryName,
            contrabandPic: `${contractPicPath}/${time}_${i + 1}.jpg`,
            categoryId: unpackCategory.categoryId,
          });
        }
        await this.unpackRecordInfoRepository.save(saveUnpackRecordList);
      }
    }
  }
}
