import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusEnum } from 'src/enums/order-status.enum';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { MealsService } from 'src/meals/meals.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AddInfoDto } from './dto/add-info.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private mealService: MealsService
  ) {}


  create(createOrderDto: CreateOrderDto, user: User) {
    const newOrder = this.orderRepository.create({
      ...createOrderDto,
    })

    newOrder.user = user;

    return this.orderRepository.save(newOrder);
  }


  findAll(user: User) {
    if( user.role === UserRoleEnum.ADMIN )
    {
      return this.orderRepository.find({relations: {user: true, meals: true}});
    } else 
    {
      return this.orderRepository.find({
        relations: {
          user: true,
          meals: true
        },
        where: {user: {
          email: user.email
      }}});
    }
  }


  findOne(id: number, user: User) {
    if (user.role === UserRoleEnum.ADMIN)
    {
      return this.orderRepository.findOne({
        relations: {
          user: true,
          meals: true
        },
        where: {
          id: id
        }
      })
    } else {
      return new UnauthorizedException;
    }
  }


  async deliveredOrder(id: number, user: User) {
    const order = await this.orderRepository.findOneBy({ id: id });

    if (user.role === UserRoleEnum.ADMIN) {
      order.status = OrderStatusEnum.DELIVERED;
    }

    return this.orderRepository.save(order);
  }


  async cancelOrder(id: number, user: User) {
    const order = await this.orderRepository.findOneBy({ id: id });

    if (user.role === UserRoleEnum.ADMIN || order.user === user) {
      order.status = OrderStatusEnum.CANCELED;
    }

    return this.orderRepository.save(order);
  }


  async chooseMeal(id: number, user: User, mealId: number) {
    const order = await this.orderRepository.findOne({where: {
      id: id
    }, relations: {
      user:true,
      meals:true
    }});

    if (order.user.email === user.email && order.meals.length < order.nbMeals) {
      
      const meal = await this.mealService.findOne(mealId);
      order.meals.push(meal);
      return this.orderRepository.save(order);

    } else {
      return new UnauthorizedException("You can't add meals to this order")
    }
  }

  async addInfo(id: number, user: User, info:AddInfoDto) {
    const order = await this.orderRepository.findOne({where: {
      id: id
    }, relations: {
      user:true,
      meals:true
    }});

    if (order.user.email === user.email && order.meals.length === order.nbMeals) {

      order.phone = info.phone;
      order.place = info.place;

      return this.orderRepository.save(order);

    } else {
      return new UnauthorizedException("You can't add additional info to this order")
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
