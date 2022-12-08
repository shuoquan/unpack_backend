import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  md5(text: string): string {
    const salt = 'oceandark';
    const hash = crypto.createHash('md5');

    hash.update(text + salt);
    return hash.digest('hex');
  }
}
