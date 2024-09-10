import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UtilsService,
    ConfigService,
    MailServices,
  ],
})
export class UsersModule {}
