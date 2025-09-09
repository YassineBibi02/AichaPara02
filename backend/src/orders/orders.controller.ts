import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req?: any) {
    // If user is authenticated, set userId
    if (req?.user && !createOrderDto.isGuest) {
      createOrderDto.userId = req.user.id;
    }

    return this.ordersService.create(createOrderDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findMyOrders(@Request() req: any) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user.role);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.findById(id, req.user.id, req.user.role);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req: any) {
    return this.ordersService.update(id, updateOrderDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.remove(id, req.user.role);
  }
}