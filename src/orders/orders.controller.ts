import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderDTO } from './dto/create-order.dto';
import { FindOrderDTO } from './dto/find-orders.dto';
import { OrdersService } from './orders.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Req() req: Request, @Body() createOrderDto: CreateOrderDTO) {
    return await this.ordersService.create(req.user.sub, createOrderDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(
    @Req() request: Request,
    // @Query() query: FindOrderDTO
  ) {
    // const { skip, take } = query;
    // return await this.ordersService.findAll(request.user, +skip, +take);
    return await this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Put(':id')
  async changeStatus(@Body() orderAndStatus: any) {
    return await this.ordersService.changeStatus(orderAndStatus);
  }
}
