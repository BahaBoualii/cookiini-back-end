import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { MealsService } from 'src/meals/meals.service';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Meal, Ingredient, Category])],
  controllers: [OrdersController],
  providers: [OrdersService, MealsService, CategoriesService]
})
export class OrdersModule {}
