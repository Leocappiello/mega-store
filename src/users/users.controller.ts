import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/guards/public.key';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.CLIENT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() userData: Prisma.UsersCreateInput): Promise<Users> {
    return await this.usersService.create(userData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Users> {
    try {
      return await this.usersService.findOne({ id });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userData: Prisma.UsersUpdateInput) {
    try {
      return this.usersService.updateUser({
        where: { id },
        data: userData,
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
