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
import { UpdateDTO } from './dto/update.dto';

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

  async updateUser(
    /* params: {
    where: Prisma.UsersWhereUniqueInput;
    data: Prisma.UsersUpdateInput;
  } */
    user,
    userData: UpdateDTO,
    ip: string,
    agent: any,
  ): Promise<Users> {
    const currentUser = await this.prisma.users.findUnique({
      where: { id: user.userId },
      include: { address: true },
    });
    const updateData: Prisma.UsersUpdateInput = {
      ...userData,
      address: userData.address
        ? {
            update: userData.address.map((address) => ({
              where: { id: address.id, userId: user.userId },
              data: {
                street: address.street,
                number: address.number,
                description: address.description,
              },
            })),
          }
        : undefined,
    };

    const changes = [];

    if (userData.name && userData.name !== currentUser.name) {
      changes.push({
        field: 'name',
        prevValue: currentUser.name,
        newValue: userData.name,
      });
    }

    if (userData.email && userData.email !== currentUser.email) {
      changes.push({
        field: 'email',
        prevValue: currentUser.email,
        newValue: userData.email,
      });
    }

    for (const change of changes) {
      await this.prisma.dataChangeLog.create({
        data: {
          description: `Updated ${change.field}`,
          ipAddress: ip,
          userAgent: agent,
          prevValue: change.prevValue,
          newValue: change.newValue,
          userId: user.userId, // ID del usuario al que pertenece el cambio
        },
      });
    }

    return await this.prisma.users.update({
      data: updateData,
      where: {
        id: user.userId,
      },
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

  async recoverPassword(user: string) {
    try {
      const userRecover = await this.prisma.users.findFirstOrThrow({
        where: {
          OR: [{ username: user }, { email: user }],
        },
      });
      const token = this.jwtService.sign({
        userId: userRecover.id,
      });
      await this.mailService.sendMail(
        userRecover.email,
        'Recover password',
        `the code to recover your password is ${token}`,
        '',
      );
      await this.prisma.users.update({
        where: {
          id: user,
        },
        data: {
          recoverPassword: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Error recovering password user');
    }
  }

  async changePassword(code: string, pass: string) {
    const { id } = this.jwtService.decode(code);
    try {
      await this.prisma.users.update({
        where: {
          id,
        },
        data: {
          password: await hash(pass, 10),
        },
      });

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getDataChanges(user: string) {
    try {
      return await this.prisma.dataChangeLog.findMany({
        where: {
          id: user,
        },
      });
    } catch (error) {
      throw new NotFoundException('User not found!');
    }
  }
}
