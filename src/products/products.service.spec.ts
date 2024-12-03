import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const mockCreatedProduct = {
    id: 1,
    name: 'Product A',
    price: 100,
    description: 'A great product',
    quantity: 10,
    subcategory: {
      id: 1,
      name: 'Subcategory 1',
      category: {
        name: 'Category 1',
      },
    },
    imageUrls: [
      { imageUrl: 'http://image1.com', productId: 1 },
      { imageUrl: 'http://image2.com', productId: 1 },
    ],
  };

  const mockPrismaService = {
    status: {
      findFirst: jest.fn(),
    },
    subcategory: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
    product: {
      create: jest.fn(),
    },
    images: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  // it('should create a product successfully', async () => {
  //   const createProductDto: CreateProductDto = {
  //     name: 'Product A',
  //     price: 100,
  //     description: 'A great product',
  //     quantity: 10,
  //     subcategory: 'Subcategory 1',
  //     imageUrls: ['http://image1.com', 'http://image2.com'],
  //   };

  //   // Mock de las dependencias de Prisma
  //   mockPrismaService.status.findFirst.mockResolvedValue({
  //     id: 1,
  //     name: 'AVAILABLE',
  //   });
  //   mockPrismaService.subcategory.findFirst.mockResolvedValue({
  //     id: 1,
  //     name: 'Subcategory 1',
  //     category: { name: 'Category 1' },
  //   });

  //   const mockCreatedProduct = {
  //     id: 1,
  //     name: 'Product A',
  //     price: 100,
  //     description: 'A great product',
  //     quantity: 10,
  //     subcategory: {
  //       id: 1,
  //       name: 'Subcategory 1',
  //       category: {
  //         name: 'Category 1',
  //       },
  //     },
  //     imageUrls: [
  //       { imageUrl: 'http://image1.com', productId: 1 },
  //       { imageUrl: 'http://image2.com', productId: 1 },
  //     ],
  //   };

  //   // Mock del comportamiento del producto creado
  //   mockPrismaService.product.create.mockResolvedValue(mockCreatedProduct);

  //   // Ejecutamos el servicio create
  //   const result = await service.create(createProductDto);

  //   // Agregar un log para inspeccionar las llamadas a `product.create`
  //   // console.log(mockPrismaService.product.create.mock.calls);

  //   // Verificamos que el servicio devolvió el producto correctamente
  //   console.log(result);
  //   console.log(mockCreatedProduct);
  //   expect(result).toEqual(mockCreatedProduct);
  // });

  it('should throw an error if status "AVAILABLE" is not found', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Product B',
      price: 50,
      description: 'Another great product',
      quantity: 5,
      subcategory: 'Subcategory 1',
    };

    // Simulamos que no se encuentra el estado "AVAILABLE"
    mockPrismaService.status.findFirst.mockResolvedValue(null);

    try {
      await service.create(createProductDto);
    } catch (error) {
      expect(error.message).toBe('Status not found');
    }
  });
});
