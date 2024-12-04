import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const comparePass = await compare(pass, user.password);
    if (user && comparePass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userDTO: LoginDTO, ip: string, agent: any) {
    const { username, password } = userDTO;
    const user = await this.validateUser(username, password);

    if (!user) throw new NotFoundException('User not found');

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      active: user.active,
    };
    await this.prismaService.loginLog.create({
      data: {
        ipAddress: ip,
        timestamp: new Date().toISOString(),
        userAgent: agent,
        userId: user.id,
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  async generateTwoFactorSecret(userId: string) {
    try {
      await this.prismaService.users.findFirstOrThrow({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
    const secret = speakeasy.generateSecret({
      name: `MegaStore - ${userId}`,
    });
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthEnabled: true,
        twoFactorSecret: secret,
      },
    });
  }

  async verifyTwoFactorCode(userId: string, code: string) {
    try {
      const user = await this.prismaService.users.findFirstOrThrow({
        where: {
          id: userId,
          isTwoFactorAuthEnabled: true,
        },
      });

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
      });

      if (!verified) throw new Error('Código de verificación inválido.');

      return HttpStatus.OK;
    } catch (error) {
      throw new NotFoundException('User not found or two-factor not enabled');
    }
  }
}
