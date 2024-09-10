import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}
  generateRandomCodeVerification(userId: string): string {
    return sign(
      {
        userId,
      },
      this.configService.getOrThrow('SECRET'),
      { expiresIn: '1h' },
    );
  }
}
