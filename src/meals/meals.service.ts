import { Injectable, NotFoundException, Options, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Repository, In } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

@Injectable()
export class MealsService {

  constructor (
    @InjectRepository(Meal) private mealRepository: Repository<Meal>,
    @InjectRepository(Ingredient) private ingredientRepository: Repository<Ingredient>,
    private readonly categoriesService: CategoriesService
  ) {

  }


  //create a new meal with its related ingredients 
  //one json that's divided into "meal"(createMealDto), "ingredients"(createIngredientDto[]) and "categories"
  async create(createMealDto: CreateMealDto, ingredients: CreateIngredientDto[], categories: number[], user: User) {
    
    if (user.role === UserRoleEnum.ADMIN){

      const newMeal = this.mealRepository.create({
        ...createMealDto,
      })
  
  
      //link ingredients 
  
      const ings: Ingredient[] = [];
  
      ingredients.forEach(ingredient => {
        const ing = this.ingredientRepository.create({
          ...ingredient
        });
  
        ings.push(ing);
  
      });
  
      newMeal.ingredients = ings;
  
  
      //link categories 
  
      newMeal.categories = [];
  
      for(const id in categories) {
        const catg = await this.categoriesService.findOne(categories[id]);
  
        newMeal.categories.push(catg);
      }
  
      return await this.mealRepository.save(newMeal);
    } else {
      return new UnauthorizedException();
    }
    
    
    
  }

  //find all the measl with their corresponding ingredients
  async findAll(): Promise<Meal[]> {
    return await this.mealRepository.find({relations: {
      ingredients: true,
      categories: true
  },});
  }

  //find a meal with the help of its id with its corresponding ingredients
  async findOne(id: number): Promise<Meal> {
    return await this.mealRepository.findOne({
      where: { id: id }, 
      relations: { ingredients: true, categories:true }
    })
  }

  //update a certain meal 
  async update(id: number, updateMealDto: UpdateMealDto): Promise<Meal> {
    const newMeal = await this.mealRepository.preload({
      id,
      ...updateMealDto
    });

    return await this.mealRepository.save(newMeal);
  }

  //remove a certain meal 
  async remove(id: number) {
    const mealToRemove = await this.mealRepository.findOne({where: { id: id }, relations: { ingredients: true }});
    if(!mealToRemove) {
      throw new NotFoundException('The meal is not found!');
    }
    else {
      await this.mealRepository.remove(mealToRemove);
      return ('Meal removed successfully!');
    }
  }

  //find by timing interval
  async findByTiming(min: number, max: number): Promise<Meal[]> {
    const qb = this.mealRepository.createQueryBuilder("meal");
    return await qb.select()
      .innerJoinAndSelect("meal.ingredients", "ingredients")
      .where ("meal.time <= :max", {max:max})
      .andWhere ("meal.time >= :min", {min:min})
      .getMany();
  }

  //find by calories interval 
  async findByCalories(min: number, max: number): Promise<Meal[]> {
    const qb = this.mealRepository.createQueryBuilder("meal");
    return await qb.select()
      .innerJoinAndSelect("meal.ingredients", "ingredients")
      .where ("meal.calories <= :max", {max:max})
      .andWhere ("meal.calories >= :min", {min:min})
      .getMany();
  }

  //find by rating min 
  async findByRating(minRating: number): Promise<Meal[]> {
    const qb = this.mealRepository.createQueryBuilder("meal");
    return await qb.select()
      .innerJoinAndSelect("meal.ingredients", "ingredients")
      .where ("meal.calories >= :min", {max:minRating})
      .getMany();
  }

  //rate a specific meal 
  async rateMeal(id: number, rating: number): Promise<Meal> {
    const mealToRate = await this.findOne(id);
    mealToRate.nbPeople += 1;
    mealToRate.totalRating += rating;
    mealToRate.rating = mealToRate.totalRating / mealToRate.nbPeople;

    return await this.mealRepository.save(mealToRate);
  }

  //find by one category
  async findByCategory(id:number): Promise<Meal[]> {
    const catg = await this.categoriesService.findOne(id);
    const name = catg.name;
    return await this.mealRepository.find({
      relations: {
        ingredients: true,
        categories: true
      },
      where: {
        categories: {
          name: In([name])
        }
      }
    })
  }

  // find by more than one category
  async findByCategories(ids:number[]): Promise<Meal[]> {

   const names: string[] = [];

    for (const id in ids) {
      names.push((await this.categoriesService.findOne(ids[id])).name);
    }

    return await this.mealRepository.find({
      relations: {
        ingredients: true,
        categories: true
      },
      where: {
        categories: {
          name: In(names)
        }
      }
    })
  }
}
