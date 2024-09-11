import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/guards/public.key';
import { Role } from 'src/auth/role.enum';
import { ChangePassDTO } from './dto/ChangePass.dto';
import { UpdateDTO } from './dto/update.dto';
import { UsersService } from './users.service';

interface JwtPayload {
  userId: string;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload; // Define la propiedad `user` que puede tener el tipo `JwtPayload`
  }
}

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

  @Put()
  async update(@Req() request: Request, @Body() userData: UpdateDTO) {
    return await this.usersService.updateUser(
      request.user,
      userData,
      request.ip,
      request.headers['user-agent'],
    );
  }

  @Public()
  @Post('activate')
  activate(@Query('token') token: string) {
    console.log(token);
    return this.usersService.activateUser(token);
  }

  @Public()
  @Get('/recoverPassword')
  async recoverPassword(userOrEmail: any) {
    return await this.usersService.recoverPassword(userOrEmail);
  }

  @Public()
  @Post('/changePassword')
  async changePassword(
    @Query('code') code: string,
    @Body() { password }: ChangePassDTO,
  ) {
    return await this.usersService.changePassword(code, password);
  }

  @Get('/dataChanges')
  async getChanges(@Req() request: Request) {
    return await this.usersService.getDataChanges(request.user.userId);
  }
}
