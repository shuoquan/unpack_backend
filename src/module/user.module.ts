import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { CryptoService } from '../service/crypto.service';
import { JwtModule } from '@nestjs/jwt';
import { Account } from '../database/account.entity';
import { ConfigService } from '../service/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        secret: cfg.jwtSecret,
        signOptions: { expiresIn: '12h' },
      }),
    }),
    HttpModule,
  ],
  providers: [UserService, CryptoService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
