import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';

@Module({
  controllers: [AlertController],
  providers: [AlertService, PrismaService, MailServices, ConfigService],
})
export class AlertModule {}
