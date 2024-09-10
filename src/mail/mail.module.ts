import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailServices } from './mail.service';

@Module({
  providers: [MailServices, ConfigService],
})
export class MailModule {}
