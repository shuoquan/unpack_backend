import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

function logger(req, res, next) {
  Logger.log(req.url, req.method, false);
  next();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(logger);
  await app.listen(3000);
}
bootstrap();
