import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from './utils.service';

@Module({
  providers: [UtilsService, ConfigService],
})
export class UtilsModule {}
