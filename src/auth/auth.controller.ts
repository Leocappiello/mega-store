import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

import { JwtAuthGuard } from './guards/jwt.guard';
import { Public } from './guards/public.key';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user, req.ip, req.headers['user-agent']);
  }

  @Post('test2fa')
  @UseGuards(JwtAuthGuard)
  async test(@Req() request: Request) {
    return await this.authService.generateTwoFactorSecret(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  async verifyTwoFactorAuth(@Req() req, @Body('code') code: string) {
    return await this.authService.verifyTwoFactorCode(req.user.sub, code);
  }
}
