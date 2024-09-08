import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    const existUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          {
            username: data.username,
          },
          {
            email: data.email,
          },
        ],
      },
    });
    if (existUser) throw new ConflictException('User already exists');

    const hashedPassword = await hash(data.password, 10);
    data.password = hashedPassword;
    data.role = 'CLIENT';

    const result = await this.prisma.users.create({
      data,
    });
    delete result.password;
    return result;
  }

  findOne(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
  ): Promise<Users | null> {
    return this.prisma.users.findUniqueOrThrow({
      where: userWhereUniqueInput,
    });
  }

  async updateUser(params: {
    where: Prisma.UsersWhereUniqueInput;
    data: Prisma.UsersUpdateInput;
  }): Promise<Users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }
}
