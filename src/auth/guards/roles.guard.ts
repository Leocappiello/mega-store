// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../role.enum';

// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { ROLES_KEY } from '../decorators/roles.decorator';
// import { Role } from '../role.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<any> {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       return true;
//     }

//     const user = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(user);
//     const { role } = await this.jwtService.verifyAsync(token, {
//       secret: this.configService.getOrThrow('secretOrPrivateKey'),
//     });

//     if (role.name === Role.ADMIN) {
//       return true;
//     }

//     return requiredRoles.some((requiredRole) => role.name === requiredRole);
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    // const { user } = context.switchToHttp().getRequest();
    const user = context.switchToHttp().getRequest();

    if (!user || !user.role || !user.role.name) {
      throw new UnauthorizedException('User role information is missing');
    }

    const userRoleName = user.role.name; // Extraemos el `name` del objeto `role`.

    if (!requiredRoles.includes(userRoleName)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}

// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/roles.decorator';
// import { Role } from '../role.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();
//     console.log(context.switchToHttp().getRequest());
//     console.log(user);
//     if (user && !requiredRoles.includes(user.role)) {
//       throw new ForbiddenException('Access denied');
//     }
//     if (!user?.role) throw new UnauthorizedException();
//     return true;
//   }
// }
