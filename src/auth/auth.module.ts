import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    LocalStrategy,
    UtilsService,
    ConfigService,
    MailServices,
  ],
})
export class AuthModule {}
