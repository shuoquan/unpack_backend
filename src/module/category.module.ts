import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../service/category.service';
import { CategoryController } from '../controller/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([]), HttpModule],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
