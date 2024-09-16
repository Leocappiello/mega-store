import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DataChangeInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async (data) => {
        if (data && request.user && data.changes) {
          const changes = data.changes; // Los cambios se asumen que se pasan desde el servicio en la respuesta.
          for (const change of changes) {
            await this.prisma.dataChangeLog.create({
              data: {
                description: `Updated ${change.field}`,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
                prevValue: change.prevValue,
                newValue: change.newValue,
                userId: request.user.userId, // ID del usuario que realizó la acción
              },
            });
          }
        }
      }),
    );
  }
}
