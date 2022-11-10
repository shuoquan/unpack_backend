import { forwardRef, Module } from '@nestjs/common';
import { SocketServerService } from '../service/socketServer.service';

@Module({
  imports: [],
  providers: [SocketServerService],
  exports: [SocketServerService],
  controllers: [],
})
export class SocketModule {}
