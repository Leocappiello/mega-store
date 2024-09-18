import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Product } from '@prisma/client';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}
  generateRandomCodeVerification(userId: string): string {
    return sign(
      {
        userId,
      },
      this.configService.getOrThrow('SECRET'),
      { expiresIn: '1h' },
    );
  }

  calculateFinalPrice(products: Array<Product>): number {
    return products.reduce((finalPrice, product) => {
      return finalPrice + product.price;
    }, 0);
  }
}
