import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prisma: PrismaService,
  ) {}

  // async create(createProductDto: CreateProductDto /* , userId: string */) {
  //   const available = await this.prismaService.status.findFirst({
  //     where: { name: 'AVAILABLE' },
  //   });

  //   if (!available) throw new Error('Status not found');

  //   let subcategory = null;
  //   if (createProductDto.subcategory) {
  //     subcategory = await this.prismaService.subcategory.findFirst({
  //       where: {
  //         name: createProductDto.subcategory,
  //       },
  //       include: {
  //         category: {
  //           select: {
  //             name: true,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   const createdProduct = await this.prismaService.$transaction(
  //     async (prisma) => {
  //       const productData: any = {
  //         name: createProductDto.name,
  //         price: createProductDto.price,
  //         description: createProductDto.description,
  //         quantity: createProductDto.quantity,
  //         status: {
  //           connect: { id: available.id },
  //         },
  //       };

  //       if (subcategory) {
  //         productData.subcategory = {
  //           connect: { id: subcategory.id },
  //         };
  //       }

  //       const product = await prisma.product.create({
  //         data: productData,
  //         include: {
  //           subcategory: {
  //             select: {
  //               name: true,
  //               category: {
  //                 select: {
  //                   name: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });

  //       if (
  //         createProductDto.imageUrls &&
  //         createProductDto.imageUrls.length > 0
  //       ) {
  //         await prisma.images.createMany({
  //           data: createProductDto.imageUrls.map((url) => ({
  //             imageUrl: url,
  //             productId: product.id,
  //           })),
  //         });
  //       }

  //       return product;
  //     },
  //   );

  //   return createdProduct;
  // }

  async create(createProductDto: CreateProductDto) {
    console.log('Comienza la creación del producto');

    // Obtener estado disponible
    const status = await this.prismaService.status.findFirst({
      where: { name: 'AVAILABLE' },
    });

    if (!status) {
      console.log('Status no encontrado');
      throw new Error('Status not found');
    }

    console.log('Status encontrado:', status);

    // Obtener subcategoría
    const subcategory = await this.prismaService.subcategory.findFirst({
      where: { name: createProductDto.subcategory },
      include: { category: { select: { name: true } } },
    });

    if (!subcategory) {
      console.log('Subcategoría no encontrada');
      throw new Error('Subcategory not found');
    }

    console.log('Subcategoría encontrada:', subcategory);

    const createdProduct = await this.prismaService.$transaction(
      async (prisma) => {
        const product = await prisma.product.create({
          data: {
            name: createProductDto.name,
            price: createProductDto.price,
            description: createProductDto.description,
            quantity: createProductDto.quantity,
            status: { connect: { id: status.id } },
            subcategory: { connect: { id: subcategory.id } },
          },
          include: {
            subcategory: {
              select: {
                name: true,
                category: { select: { name: true } },
              },
            },
          },
        });

        // Crear imágenes
        await prisma.images.createMany({
          data: createProductDto.imageUrls.map((url) => ({
            imageUrl: url,
            productId: product.id,
          })),
        });

        return product; // Retorna el producto desde la transacción
      },
    );

    console.log('Producto creado finalmente:', createdProduct);

    return createdProduct; // Asegúrate de que aquí retorne el valor correcto
  }

  findAll(page = 0, limit = 10) {
    return this.prisma.product.findMany({
      skip: page * limit,
      take: limit,
    });
  }

  findAvailable(page = 0, limit = 10) {
    return this.prisma.product.findMany({
      skip: page * limit,
      take: limit,
      where: {
        quantity: { gt: 0 },
      },
      include: {
        imagesUrls: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findFirstOrThrow({
      where: {
        id,
        quantity: { gt: 0 },
      },
      include: {
        imagesUrls: true,
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async purchase(userId: string, productId: string) {
    // const product = await this.prismaService.product.update({
    //   where: {
    //     id: productId,
    //   },
    //   data: {
    //     status: {
    //         // status purchased
    //     },
    //     ownerId: userId,
    //   }
    // });
    // if (!product) throw new NotFoundException('Product not found');
  }
}
