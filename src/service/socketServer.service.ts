import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bluebird from 'bluebird';
import * as net from 'net';
import e from 'express';

bluebird.promisifyAll(net);
// 192.168.8.177
// 192.168.8.103
const server = net.createServer().listen(9530, '0.0.0.0');
const userMap = new Map();
const dataMap = new Map();
const logger = new Logger('SOCKETSERVER');

@Injectable()
export class SocketServerService {
  constructor() {
    logger.log(`SOCKET INIT`, 'socket初始化');
    this.init();
  }
  init() {
    server.on('connection', socket => {
      logger.log(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`);
      const name = socket.remoteAddress + ':' + socket.remotePort;
      userMap.set(name, socket);
      socket.on('data', data => {
        try {
          logger.log(`RECEIVEDATA: ${socket.remoteAddress}:${socket.remotePort}, ${data.toString()}`);
          const deviceData = Buffer.concat([dataMap.get(name) || Buffer.from(''), data]);
          let index = -1;
          for (let i = 0; i < deviceData.length; i++) {
            if (deviceData[i] === 0x0a) {
              index = i;
              break;
            }
          }
          if (index > 0) {
            const msg = deviceData.slice(0, index).toString();
            if (msg === 'ping') {
              socket.write('pong\n');
            }
          }
          const leftData = deviceData.slice(index + 1);
          if (leftData.length > 0) {
            dataMap.set(name, leftData);
          } else {
            dataMap.delete(name);
          }
        } catch (e) {
          logger.log(`ERRORDATA: ${socket.remoteAddress}:${socket.remotePort}, ${e.toString()}`);
        }
      });
      socket.on('error', data => {
        logger.log(`ERROR: ${socket.remoteAddress}:${socket.remotePort}, ${data.toString()}`);
      });
      socket.on('end', data => {
        userMap.delete(name);
        logger.log(`ENDED: ${socket.remoteAddress}:${socket.remotePort}`);
      });
    });
  }

  broadcastNewBagId(bagId: number) {
    for (const entry of userMap.entries()) {
      const [name, socket] = [entry[0], entry[1]];
      if (socket) {
        logger.log(`BROADCAST: ${name}, ${bagId}`);
        socket.write(`${bagId}\n`);
      }
    }
  }
}
