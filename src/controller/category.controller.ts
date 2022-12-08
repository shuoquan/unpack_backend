import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from '../service/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get('')
  async getCategoryList() {
    return this.categoryService.getCategoryList();
  }
}
