import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Path from 'path';
import { ConfigModule } from './module/config.module';
import { ConfigService } from './service/config.service';
import { BagModule } from './module/bag.module';
import { SocketModule } from './module/socket.module';

const Orm = (): DynamicModule => {
  const config = new ConfigService(Path.join(__dirname, `../env/${process.env.NODE_ENV || 'development'}.env`));

  return TypeOrmModule.forRoot({
    host: 'localhost',
    type: 'postgres',
    port: config.pgPort,
    username: config.pgUsername,
    password: config.pgPassword,
    database: config.pgDatabase,
    entities: [__dirname + '/database/*.entity{.ts,.js}'],
    synchronize: config.pgSynchronize,
  });
};

@Module({
  imports: [ConfigModule, BagModule, SocketModule, Orm()],
})
export class AppModule {}
