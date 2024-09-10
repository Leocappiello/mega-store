import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/guards/public.key';
import { Role } from 'src/auth/role.enum';
import { UsersService } from './users.service';

@Controller('users')
// @UseGuards(RolesGuard)
@Roles(Role.CLIENT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() userData: Prisma.UsersCreateInput): Promise<Users> {
    return await this.usersService.createClient(userData);
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

  @Public()
  @Post('activate')
  activate(@Query('token') token: string) {
    console.log(token);
    return this.usersService.activateUser(token);
  }
}
