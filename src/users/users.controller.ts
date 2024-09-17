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
  UseGuards,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/guards/public.key';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/role.enum';
import { ChangePassDTO } from './dto/ChangePass.dto';
import { ModifyRolesDTO } from './dto/modifyRoles.dto';
import { UsersService } from './users.service';

interface JwtPayload {
  sub: string;
  active: boolean;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload; // Define la propiedad `user` que puede tener el tipo `JwtPayload`
  }
}

// @UseGuards(RolesGuard)
// @Roles(Role.CLIENT)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('changePassword')
  async changePassword(
    @Query('code') code: string,
    @Body() { password }: ChangePassDTO,
  ) {
    return await this.usersService.changePassword(code, password);
  }

  @Post()
  @Public()
  async create(
    @Body() userData: Prisma.UsersCreateInput,
  ): Promise<Prisma.UsersCreateInput> {
    return await this.usersService.createClient(userData);
  }

  @Put()
  async update(
    @Req() request: Request,
    @Body() userData: Prisma.UsersUpdateInput,
  ): Promise<Users> {
    return await this.usersService.updateUser(
      request.user.sub,
      userData,
      request.ip,
      request.headers['user-agent'],
    );
  }

  @Post('activate')
  @Public()
  activate(@Query('token') token: string) {
    console.log(token);
    return this.usersService.activateUser(token);
  }

  @Public()
  @Get('recoverPassword')
  async recoverPassword(@Body('userOrEmail') userOrEmail: string) {
    return await this.usersService.recoverPassword(userOrEmail);
  }

  @Get('dataChanges')
  async getChanges(@Req() request: Request) {
    return await this.usersService.getDataChanges(request.user.sub);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<Users> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('roles/:id')
  async getUserRoles(@Req() request: Request, @Param('id') id: string) {
    return await this.usersService.getUserRoles(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('roles/:id')
  async modifyUserRoles(
    @Req() request: Request,
    @Body() roles: ModifyRolesDTO,
    @Param('id') id: string,
  ) {
    return await this.usersService.modifyUserRoles(id, roles);
  }
}
