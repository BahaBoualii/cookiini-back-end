import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealsModule } from './meals/meals.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { Meal } from './meals/entities/meal.entity';
import { Ingredient } from './ingredients/entities/ingredient.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      port: 3306,
      password: '',
      database: 'cookiinidb',
      entities: [Meal, Ingredient, Category, User, Order],
      synchronize : true,
    }),
    MealsModule, 
    IngredientsModule,
    CategoriesModule, 
    UsersModule, 
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
