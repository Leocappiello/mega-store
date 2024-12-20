import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('secretOrPrivateKey'),
    });
  }

  async validate(payload: any) {
    // return { sub: payload.sub, role: payload.role, active: payload.active };

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      active: payload.active,
    };
  }
}
