import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FindOrderDTO } from './dto/find-orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() query: FindOrderDTO,
    // @Query('skip', new ParseIntPipe({ errorHttpStatusCode: 400 })) skip: number,
    // @Query('take', new ParseIntPipe({ errorHttpStatusCode: 400 })) take: number,
  ) {
    const { skip, take } = query;
    return await this.ordersService.findAll(request.user, +skip, +take);
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
}
