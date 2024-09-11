import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderDto: any) {
    return 'This action adds a new order';
  }

  async findAll(user, skip = 0, take = 5) {
    if (!user.userId) throw new NotFoundException('User not found');
    return await this.prismaService.order.findMany({
      where: {
        id: user.userId,
      },
      skip,
      take,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(user, updateOrderDto: any) {
    return `This action updates a  order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
