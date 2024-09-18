import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  async create(user: string, createOrderDto: CreateOrderDTO) {
    const { products } = createOrderDto;
    const existsProducts = await this.prismaService.product.findMany({
      where: {
        id: {
          in: products,
        },
      },
    });
    if (!existsProducts) throw new NotFoundException('Products not found');

    console.log(existsProducts);
    const order = await this.prismaService.order.create({
      data: {
        ownerId: user,
        products: {
          connect: products.map((productId) => ({ id: productId })),
        },
        finalPrice: this.utils.calculateFinalPrice(existsProducts),
      },
    });
    return order;
  }

  async findAll(user, skip = 0, take = 5) {
    if (!user.sub) throw new NotFoundException('User not found');
    return await this.prismaService.order.findMany({
      where: {
        id: user.sub,
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
