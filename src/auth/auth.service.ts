import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, ip: string, agent: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    await this.prismaService.loginLog.create({
      data: {
        ipAddress: ip,
        timestamp: Date.now().toString(),
        userAgent: agent,
        userId: user.id,
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
