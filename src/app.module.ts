import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ActivitiesModule } from './activities/activities.module';
import { AlertModule } from './alert/alert.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CategoriesModule } from './categories/categories.module';
import { DiscountsModule } from './discounts/discounts.module';
import { FeedbackModule } from './feedback/feedback.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaService } from './prisma.service';
import { ProductsModule } from './products/products.module';
import { RoleModule } from './role/role.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { StoreModule } from './store/store.module';
import { SupportModule } from './support/support.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
    TransactionsModule,
    ShipmentsModule,
    StoreModule,
    SupportModule,
    UsersModule,
    ActivitiesModule,
    ShoppingCartModule,
    NotificationsModule,
    DiscountsModule,
    RoleModule,
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('EXPIRES'),
        },
        // secretOrPrivateKey: configService.getOrThrow('secretOrPrivateKey'),
      }),
      inject: [ConfigService],
    }),
    MailModule,
    UtilsModule,
    AlertModule,
    EventEmitterModule.forRoot(),
    FeedbackModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}
