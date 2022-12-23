import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Path from 'path';
import { ConfigModule } from './module/config.module';
import { ConfigService } from './service/config.service';
import { BagModule } from './module/bag.module';
import { SocketModule } from './module/socket.module';
import { AuthModule } from './module/auth.module';
import { UserModule } from './module/user.module';
import { CategoryModule } from './module/category.module';
import { StatisticModule } from './module/statistic.module';

const PostgresOrm = (): DynamicModule => {
  const config = new ConfigService(Path.join(__dirname, `../env/${process.env.NODE_ENV || 'development'}.env`));

  return TypeOrmModule.forRoot({
    host: 'localhost',
    type: 'postgres',
    port: config.pgPort,
    username: config.pgUsername,
    password: config.pgPassword,
    database: config.pgDatabase,
    entities: [__dirname + '/database/postgresql/*.entity{.ts,.js}'],
    synchronize: config.pgSynchronize,
  });
};

const MysqlOrm = (): DynamicModule => {
  return TypeOrmModule.forRoot({
    host: 'localhost',
    type: 'mysql',
    port: 3306,
    username: 'root',
    password: 'reload123',
    database: 'detect_pth',
    entities: [__dirname + '/database/mysql/*.entity{.ts,.js}'],
    synchronize: false,
    name: 'mysql',
  });
};

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    UserModule,
    ConfigModule,
    BagModule,
    SocketModule,
    StatisticModule,
    PostgresOrm(),
    MysqlOrm(),
  ],
})
export class AppModule {}
