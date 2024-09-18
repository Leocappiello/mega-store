import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ShoppingCartService } from './shopping-cart.service';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}
  @Get()
  async getUserShoppingCart(@Req() req: Request) {
    return this.shoppingCartService.getShoppingCart(req.user.sub);
  }
}
