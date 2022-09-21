import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AddInfoDto } from './dto/add-info.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @UserDecorator() user:User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@UserDecorator() user:User) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @UserDecorator() user:User) {
    return this.ordersService.findOne(+id, user);
  }

  @Patch('cancel/:id')
  @UseGuards(JwtAuthGuard)
  cancelOrder(@Param('id') id: string, @UserDecorator() user:User) {
    return this.ordersService.cancelOrder(+id, user);
  }

  @Patch('delivered/:id')
  @UseGuards(JwtAuthGuard)
  deliveredOrder(@Param('id') id: string, @UserDecorator() user:User) {
    return this.ordersService.deliveredOrder(+id, user);
  }

  @Patch('add-meal/:id/:mealId')
  @UseGuards(JwtAuthGuard)
  addMeal(@Param('id') id: string, @Param('mealId') mealId: string, @UserDecorator() user:User) {
    return this.ordersService.chooseMeal(+id, user, +mealId);
  }

  @Patch('add-info/:id')
  @UseGuards(JwtAuthGuard)
  addInfo(@Param('id') id: string, @Body() info: AddInfoDto, @UserDecorator() user:User) {
    return this.ordersService.addInfo(+id, user, info);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
