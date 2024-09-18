import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShoppingCartService {
  constructor(private readonly prisma: PrismaService) {}
  async getShoppingCart(id: string) {
    const userSC = await this.prisma.shoppingCart.findFirst({
      where: {
        userId: id,
      },
      select: {
        products: true,
      },
    });

    if (!userSC) throw new NotFoundException('ShoppingCart not found');

    return userSC;
  }
}
