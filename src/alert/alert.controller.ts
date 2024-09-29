import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlertService } from './alert.service';

interface OrderCreatedEvent {
  productId: string;
}

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @OnEvent('order.created')
  async purchase(payload: OrderCreatedEvent) {
    const { productId } = payload;
    await this.alertService.purchase(productId);
  }
}
