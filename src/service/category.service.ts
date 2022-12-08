import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('category');

  constructor() {}

  getCategoryList() {
    return [
      {
        id: 1,
        name: '刀具',
      },
      {
        id: 2,
        name: '枪支',
      },
      {
        id: 3,
        name: '弹药',
      },
      {
        id: 4,
        name: '警械',
      },
      {
        id: 5,
        name: '爆炸物',
      },
      {
        id: 6,
        name: '烟花爆竹',
      },
      {
        id: 7,
        name: '危险液体',
      },
      {
        id: 8,
        name: '压力罐',
      },
      {
        id: 9,
        name: '锤子斧头',
      },
      {
        id: 10,
        name: '蓄电池',
      },
      {
        id: 11,
        name: '移动电源',
      },
      {
        id: 12,
        name: '打火机',
      },
      {
        id: 13,
        name: '打火机',
      },
      {
        id: 14,
        name: '其他',
      },
    ];
  }
}
