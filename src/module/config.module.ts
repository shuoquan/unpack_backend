import { Module, Global } from '@nestjs/common';
import { ConfigService } from '../service/config.service';
import * as Path from 'path';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        Path.join(
          __dirname,
          `../../env/${process.env.NODE_ENV || 'development'}.env`,
        ),
      ),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
