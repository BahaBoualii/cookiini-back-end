import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body("meal") createMealDto: CreateMealDto, @Body("ingredients") createIngredientsDto: CreateIngredientDto[], @Body("categories") categories: number[], @UserDecorator() user:User) {
    return this.mealsService.create(createMealDto, createIngredientsDto, categories, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.mealsService.findAll();
  }

  @Get('time/:min/:max')
  findByTiming(@Param('min') min: number, @Param('max') max:number){
    return this.mealsService.findByTiming(min,max);
  }

  @Get('calories/:min/:max')
  findByCalories(@Param('min') min: number, @Param('max') max:number){
    return this.mealsService.findByCalories(min,max);
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: number){
    return this.mealsService.findByCategory(+id);
  }

  @Get('categories')
  findByCategories(@Body('ids') ids: number[]){
    return this.mealsService.findByCategories(ids);
  }

  @Get('rating/:min')
  findByRating(@Param('min') min: number){
    return this.mealsService.findByRating(min);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.mealsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealsService.update(+id, updateMealDto);
  }

  @Patch('rate/:id/:rating')
  rate(@Param('id') id: number, @Param('rating') rating: number) {
    return this.mealsService.rateMeal(+id, +rating);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealsService.remove(+id);
  }
}
