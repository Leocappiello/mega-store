import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Users } from '@prisma/client';
import { hash } from 'bcryptjs';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
    private mailService: MailServices,
  ) {}

  async createClient(data: Prisma.UsersCreateInput): Promise<Users> {
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
    data.role = null;
    data.codeVerification = this.utilsService.generateRandomCodeVerification(
      data.id,
    );

    const result = await this.prisma.users.create({
      data,
    });
    delete result.password;
    await this.mailService.sendMail(data.email, 'Activa tu cuenta', '', '');
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

  async activateUser(token: string) {
    try {
      const { userId } = this.jwtService.decode(token);
      const result = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!result) throw new NotFoundException('User not found');

      await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          active: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
