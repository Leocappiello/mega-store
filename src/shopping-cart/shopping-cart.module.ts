import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';

@Module({
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, PrismaService],
})
export class ShoppingCartModule {}
