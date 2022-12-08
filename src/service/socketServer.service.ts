import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bluebird from 'bluebird';
import * as net from 'net';
import e from 'express';

bluebird.promisifyAll(net);
// 192.168.8.177
// 192.168.8.103
const server = net.createServer().listen(9530, 'localhost');
const userMap = new Map();
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
        socket.write(`${bagId}`);
      }
    }
  }
}
