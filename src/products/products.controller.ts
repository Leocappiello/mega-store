import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

// @UseGuards(RolesGuard)

// @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(
      createProductDto /* ,
      request.user.sub, */,
    );
  }

  @Get('/all')
  findAll() {
    return this.productsService.findAll();
  }

  @Get()
  @Public()
  findAvailable() {
    return this.productsService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Public()
  @Post('/:id/purchase')
  async purchase(@Req() req: Request, @Query('id') id: string) {
    return await this.productsService.purchase(req.user.sub, id);
  }
}
