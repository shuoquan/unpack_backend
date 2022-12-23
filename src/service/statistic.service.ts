import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Bag } from '../database/postgresql/bag.entity';
import { Image } from '../database/mysql/image.entity';
import { Annotation } from '../database/mysql/annotation.entity';
import { UnpackBoxInfo } from '../database/postgresql/unpack_box_info.entity';
import { UnpackRecordInfo } from '../database/postgresql/unpack_record_info.entity';
import { OriginalBag } from '../database/mysql/original_bag.entity';

@Injectable()
export class StatisticService {
  private readonly logger = new Logger('statistic');

  constructor(
    @InjectRepository(Bag)
    private readonly bagRepository: Repository<Bag>,
    @InjectRepository(UnpackBoxInfo)
    private readonly unpackBoxInfoRepository: Repository<UnpackBoxInfo>,
    @InjectRepository(UnpackRecordInfo)
    private readonly unpackRecordInfoRepository: Repository<UnpackRecordInfo>,
    @InjectRepository(Image, 'mysql')
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Annotation, 'mysql')
    private readonly annotationRepository: Repository<Image>,
    @InjectRepository(OriginalBag, 'mysql')
    private readonly originBagRepository: Repository<OriginalBag>,
  ) {}

  async getStatisticData(startTime: number, endTime: number, auditorId = 0) {
    if (!startTime || !endTime) throw new HttpException('参数错误', 400);
    // [旅客过包数, 实际开包数]
    const [
      passengerBagCnt,
      actualUnpackBagCnt,
      registerContrabandCnt,
      auditorUnpackBagCnt,
      detectRecommendCnt,
      auditorWrongCnt,
      xmanWrongCnt,
    ] = await Promise.all([
      this.originBagRepository.query(
        `SELECT COUNT(*) AS cnt FROM bag WHERE image_id in (SELECT id FROM image WHERE time BETWEEN ? AND ?)`,
        [startTime, endTime],
      ),
      this.bagRepository.query(
        `select count(*) as cnt from bag where create_at between $1 and $2 and status = '2' ${
          auditorId ? ` and review_auditor_id = ${auditorId}` : ''
        }`,
        [new Date(startTime), new Date(endTime)],
      ),
      this.unpackRecordInfoRepository.query(
        `select count(*) as cnt from unpack_record_info where bag_id in (select id from bag where create_at between $1 and $2 and status = '2' ${
          auditorId ? ` and review_auditor_id = ${auditorId}` : ''
        })`,
        [new Date(startTime), new Date(endTime)],
      ),
      this.originBagRepository.query(
        `SELECT COUNT(*) AS cnt FROM bag WHERE image_id in (SELECT id FROM image WHERE time BETWEEN ? AND ?) and user_check = 1 ${
          auditorId ? `and user = ${auditorId}` : ''
        }`,
        [startTime, endTime].concat(auditorId ? [auditorId] : []),
      ),
      this.originBagRepository.query(
        `SELECT COUNT(*) AS cnt FROM bag WHERE image_id in (SELECT id FROM image WHERE time BETWEEN ? AND ?) and xman_check = 1 ${
          auditorId ? `and user = ${auditorId}` : ''
        }`,
        [startTime, endTime].concat(auditorId ? [auditorId] : []),
      ),
      this.originBagRepository.query(
        `SELECT COUNT(*) AS cnt FROM bag WHERE image_id in (SELECT id FROM image WHERE time BETWEEN ? AND ?) and danger > -1 and danger != user_check ${
          auditorId ? `and user = ${auditorId}` : ''
        }`,
        [startTime, endTime].concat(auditorId ? [auditorId] : []),
      ),
      this.originBagRepository.query(
        `SELECT COUNT(*) AS cnt FROM bag WHERE image_id in (SELECT id FROM image WHERE time BETWEEN ? AND ?) and danger > -1 and danger != xman_check ${
          auditorId ? `and user = ${auditorId}` : ''
        }`,
        [startTime, endTime].concat(auditorId ? [auditorId] : []),
      ),
    ]);
    return {
      passengerBagCnt: parseInt(passengerBagCnt[0].cnt),
      actualUnpackBagCnt: parseInt(actualUnpackBagCnt[0].cnt),
      registerContrabandCnt: parseInt(registerContrabandCnt[0].cnt),
      auditorUnpackBagCnt: parseInt(auditorUnpackBagCnt[0].cnt),
      detectRecommendCnt: parseInt(detectRecommendCnt[0].cnt),
      auditorWrongCnt: parseInt(auditorWrongCnt[0].cnt),
      xmanWrongCnt: parseInt(xmanWrongCnt[0].cnt),
    };
  }

  // typeId: 0-开包图片 1-收藏图片 2-漏开图片 3-误开图片
  async getStatisticImageList(startTime, endTime, page = 0, pageSize = 1, auditorId = 0, typeId = 0) {
    let sql = `select *, b.id id from bag b inner join image i on b.image_id = i.id where i.time between ? and ?`;
    const params = [startTime, endTime];
    if (auditorId) {
      sql += ` and b.user = ?`;
      params.push(auditorId);
    }
    if (typeId === 0) {
      sql += ` and b.user_check = 1`;
    } else if (typeId === 1) {
      sql += ` and b.mark = 1`;
    } else if (typeId === 2) {
      sql += ` and b.danger = 1 and b.user_check = 0`;
    } else if (typeId === 3) {
      sql += ` and b.danger = 0 and b.user_check = 1`;
    }
    sql += ` order by b.id desc limit ?, ?`;
    params.push(page * pageSize, pageSize);
    const bagList = await this.originBagRepository.query(sql, params);
    const bagIds = bagList.map(bag => bag.id);
    const annoList = bagIds.length
      ? await this.annotationRepository.find({
          where: {
            bagId: In(bagIds),
          },
        })
      : [];
    const annoMap = annoList.reduce((pre: any, anno: any) => {
      if (!pre[anno.bagId]) pre[anno.bagId] = [];
      anno.checkPts = JSON.parse(anno.checkPts || '[]');
      anno.type = anno.checkPts.length ? 2 : 1;
      pre[anno.bagId].push(anno);
      return pre;
    }, {});
    return bagList.map(bag => {
      const coordinate = JSON.parse(bag.box || '[]');
      return {
        ...bag,
        annotations: annoMap[bag.id] || [],
        x0: coordinate.length === 4 ? Math.min(coordinate[0], coordinate[2]) : 0,
        y0: coordinate.length === 4 ? Math.min(coordinate[1], coordinate[3]) : 0,
        x1: coordinate.length === 4 ? Math.max(coordinate[0], coordinate[2]) : bag.width,
        y1: coordinate.length === 4 ? Math.max(coordinate[1], coordinate[3]) : bag.height,
      };
    });
  }
}
