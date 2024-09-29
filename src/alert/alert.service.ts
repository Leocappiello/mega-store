import { Injectable, NotFoundException } from '@nestjs/common';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailServices,
  ) {}
  async purchase(productId: string) {
    const products = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!products) throw new NotFoundException('Not found product');

    const alerts = await this.prisma.alert.findFirst({
      where: {
        productId,
      },
    });

    const admin = await this.prisma.users.findFirst({
      where: {
        role: {
          name: 'ADMIN',
        },
      },
    });
    if (products.quantity <= alerts.quantity) {
      await this.prisma.notification.create({
        data: {
          userId: admin.id,
          message: `The product ${products.name} has low stock. Existences: ${products.quantity}`,
        },
      });
      await this.mailService.sendMail(
        admin.email,
        'Alert',
        `The product ${products.name} has low stock. Existences: ${products.quantity}`,
      );
    }
  }
}
