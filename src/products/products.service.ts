import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto /* , userId: string */) {
    const available = await this.prismaService.status.findFirst({
      where: { name: 'AVAILABLE' },
    });

    if (!available) throw new Error('Status not found');

    let subcategory = null;
    if (createProductDto.subcategory) {
      subcategory = await this.prismaService.subcategory.findFirst({
        where: {
          name: createProductDto.subcategory,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    const createdProduct = await this.prismaService.$transaction(
      async (prisma) => {
        const productData: any = {
          name: createProductDto.name,
          price: createProductDto.price,
          description: createProductDto.description,
          quantity: createProductDto.quantity,
          status: {
            connect: { id: available.id },
          },
        };

        if (subcategory) {
          productData.subcategory = {
            connect: { id: subcategory.id },
          };
        }

        const product = await prisma.product.create({
          data: productData,
          include: {
            subcategory: {
              select: {
                name: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (
          createProductDto.imageUrls &&
          createProductDto.imageUrls.length > 0
        ) {
          await prisma.images.createMany({
            data: createProductDto.imageUrls.map((url) => ({
              imageUrl: url,
              productId: product.id,
            })),
          });
        }

        return product;
      },
    );

    return createdProduct;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
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
