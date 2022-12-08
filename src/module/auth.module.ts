import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthService } from '../service/auth.service';
import { ConfigModule } from '../module/config.module';
import { ConfigService } from '../service/config.service';
import { LocalStrategy } from '../strategy/local.strategy';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../database/account.entity';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    TypeOrmModule.forFeature([Account]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        secret: cfg.jwtSecret,
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
