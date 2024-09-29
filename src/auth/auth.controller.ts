import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

import { Public } from './decorators/public.decorator';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(@Req() req: Request, @Body() body: LoginDTO) {
    return this.authService.login(body, req.ip, req.headers['user-agent']);
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
