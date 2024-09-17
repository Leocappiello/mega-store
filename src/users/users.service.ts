import {
  BadRequestException,
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
import { ModifyRolesDTO } from './dto/modifyRoles.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
    private mailService: MailServices,
  ) {}

  async createClient(data: Prisma.UsersCreateInput): Promise<any> {
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
    const { name, email, username } = data;
    const hashedPassword = await hash(data.password, 10);

    const roleClient = await this.prisma.role.findFirstOrThrow({
      where: {
        name: 'USER',
      },
    });
    const result = await this.prisma.users.create({
      data: {
        name,
        username,
        password: hashedPassword,
        email,
        codeVerification: this.utilsService.generateRandomCodeVerification(
          data.id,
        ),
        active: false,
        role: {
          connect: {
            id: roleClient.id,
          },
        },
      },
    });
    delete result.password;
    // await this.mailService.sendMail(data.email, 'Activa tu cuenta', '', '');
    return result;
  }

  // findOne(
  //   userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
  // ): Promise<Users | null> {
  //   return this.prisma.users.findUniqueOrThrow({
  //     where: userWhereUniqueInput,
  //   });
  // }

  async findOne(emailOrUsername: string): Promise<Users | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [
          {
            email: emailOrUsername,
          },
          {
            username: emailOrUsername,
          },
          {
            id: emailOrUsername,
          },
        ],
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User or email not found');
    return user;
  }

  // async updateUser(
  //   /* params: {
  //   where: Prisma.UsersWhereUniqueInput;
  //   data: Prisma.UsersUpdateInput;
  // } */
  //   user,
  //   // userData: UpdateDTO,
  //   data: Prisma.UsersUpdateInput,
  //   ip: string,
  //   agent: any,
  // ): Promise<Users> {
  //   const currentUser = await this.prisma.users.findUnique({
  //     where: { id: user.userId },
  //     include: { address: true },
  //   });
  //   const updateData: Prisma.UsersUpdateInput = {
  //     ...data,
  //     address: data.address
  //       ? {
  //           update: data.address.map((address) => ({
  //             where: { id: address.id, userId: user.userId },
  //             data: {
  //               street: address.street,
  //               number: address.number,
  //               description: address.description,
  //             },
  //           })),
  //         }
  //       : undefined,
  //   };

  //   const changes = [];

  //   if (data.name && data.name !== currentUser.name) {
  //     changes.push({
  //       field: 'name',
  //       prevValue: currentUser.name,
  //       newValue: data.name,
  //     });
  //   }

  //   if (data.email && data.email !== currentUser.email) {
  //     changes.push({
  //       field: 'email',
  //       prevValue: currentUser.email,
  //       newValue: data.email,
  //     });
  //   }

  //   for (const change of changes) {
  //     await this.prisma.dataChangeLog.create({
  //       data: {
  //         description: `Updated ${change.field}`,
  //         ipAddress: ip,
  //         userAgent: agent,
  //         prevValue: change.prevValue,
  //         newValue: change.newValue,
  //         userId: user.userId, // ID del usuario al que pertenece el cambio
  //       },
  //     });
  //   }

  //   return await this.prisma.users.update({
  //     data: updateData,
  //     where: {
  //       id: user.userId,
  //     },
  //   });
  // }

  async updateUser(
    currentUser: string,
    userData: Prisma.UsersUpdateInput,
    ipAddress: string,
    userAgent: string,
  ): Promise<Users> {
    const existingUser = await this.prisma.users.findUnique({
      where: { id: currentUser },
      include: {
        address: true,
      },
    });

    if (!existingUser) throw new BadRequestException('El usuario no existe.');

    const dataChangeLogs: Prisma.DataChangeLogCreateManyInput[] = [];

    if (userData.name && userData.name !== existingUser.name) {
      dataChangeLogs.push({
        description: 'Cambio de nombre',
        prevValue: existingUser.name,
        newValue: userData.name as string,
        userId: currentUser,
        ipAddress,
        userAgent,
      });
    }

    if (userData.username && userData.username !== existingUser.username) {
      dataChangeLogs.push({
        description: 'Cambio de nombre de usuario',
        prevValue: existingUser.username,
        newValue: userData.username as string,
        userId: currentUser,
        ipAddress,
        userAgent,
      });
    }

    if (userData.email && userData.email !== existingUser.email) {
      dataChangeLogs.push({
        description: 'Cambio de correo electrónico',
        prevValue: existingUser.email,
        newValue: userData.email as string,
        userId: currentUser,
        ipAddress,
        userAgent,
      });
    }

    if (
      userData.phoneNumber &&
      userData.phoneNumber !== existingUser.phoneNumber
    ) {
      dataChangeLogs.push({
        description: 'Cambio de numero telefonico',
        prevValue: existingUser.phoneNumber,
        newValue: userData.phoneNumber as string,
        userId: currentUser,
        ipAddress,
        userAgent,
      });
    }

    // await this.prisma.users.update({
    const updatedUser = await this.prisma.users.update({
      where: { id: currentUser },
      data: userData,
    });

    if (dataChangeLogs.length > 0) {
      await this.prisma.dataChangeLog.createMany({
        data: dataChangeLogs,
      });
    }

    return updatedUser;
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
        sub: userRecover.id,
      });
      // await this.mailService.sendMail(
      //   userRecover.email,
      //   'Recover password',
      //   `the code to recover your password is ${token}`,
      //   'prueba',
      // );
      await this.prisma.users.update({
        where: {
          id: userRecover.id,
        },
        data: {
          recoverPassword: true,
          codeRecover: token,
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Error recovering password user');
    }
  }

  async changePassword(code: string, pass: string) {
    const { sub } = this.jwtService.decode(code);
    try {
      const user = await this.prisma.users.findFirstOrThrow({
        where: {
          id: sub,
          recoverPassword: true,
          codeRecover: code,
        },
      });
      await this.prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          password: await hash(pass, 10),
          recoverPassword: false,
          codeRecover: null,
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

  async getUserRoles(id: string) {
    const user = await this.prisma.users.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async modifyUserRoles(id: string, roles: ModifyRolesDTO) {
    //   const { roles: rolesArray } = roles;
    //   const permissions = await this.prisma.rolePermission.findMany({
    //     where: {
    //       name: {
    //         in: rolesArray,
    //       },
    //     },
    //   });

    //   if (!user) throw new NotFoundException('User not found');

    //   console.log(permissions);
    //   return;
    // }
    const { roles: permissions } = roles;

    // 1. Obtener todos los roles asociados con los permisos
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        permissionId: {
          in: (
            await this.prisma.permission.findMany({
              where: {
                name: {
                  in: permissions, // Lista de nombres de permisos
                },
              },
              select: {
                id: true, // Solo selecciona el ID de los permisos
              },
            })
          ).map((p) => p.id), // Extrae solo los IDs de los permisos
        },
      },
      select: {
        roleId: true,
      },
    });

    // 2. Extraer los IDs únicos de los roles
    const roleIds = Array.from(new Set(rolePermissions.map((rp) => rp.roleId)));

    // 3. Si la relación es uno a uno, deberías tomar el primer `roleId` en lugar de un array
    const newRoleId = roleIds[0]; // Supongo que el usuario solo tendrá un rol

    // 4. Actualizar el campo `roleId` del usuario directamente
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        roleId: newRoleId,
      },
      include: {
        role: true,
      },
    });

    return updatedUser;
  }
}
