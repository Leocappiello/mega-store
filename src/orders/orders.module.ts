import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { EventEmitter } from 'stream';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    UtilsService,
    ConfigService,
    MailServices,
    EventEmitter,
  ],
})
export class OrdersModule {}
