import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { EventEmitter } from 'stream';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utils: UtilsService,
    private readonly mailService: MailServices,
    private readonly eventEmitter: EventEmitter,
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
    this.eventEmitter.emit('order.created');
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

  async findAll(skip = 0, take = 5) {
    return await this.prismaService.order.findMany({
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

  async changeStatus(orderAndStatus: any) {
    const { id, status } = orderAndStatus;
    const result = await this.prismaService.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!result) throw new BadRequestException('Error updating');

    await this.mailService.sendMail(
      result.owner.email,
      'Status changed order',
      '',
      '',
    );
    return result;
  }
}
