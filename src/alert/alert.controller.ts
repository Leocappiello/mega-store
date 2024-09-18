import { Controller } from '@nestjs/common';
import { AlertService } from './alert.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';

interface OrderCreatedEvent {}

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService, private readonly prisma: PrismaService) {}

  @OnEvent('order.created')
  purchase(payload: OrderCreatedEvent) {

  }
}
