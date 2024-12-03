import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PrismaService } from 'src/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockPrismaService = {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ userId: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        JwtService,
        ConfigService,
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should reject request without credentials', async () => {
    try {
      await controller.findAll();
    } catch (e) {
      expect(e.response.message).toBe('Unauthorized');
    }
  });

  it('should allow request with valid credentials', async () => {
    const user = { userId: 1 };
    mockJwtService.verify.mockReturnValue(user);

    const result = await controller.findAll();

    expect(result).toEqual([]);
    expect(mockPrismaService.product.findMany).toHaveBeenCalled();
  });
});
