import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { StoreModule } from './store/store.module';
import { SupportModule } from './support/support.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DiscountsModule } from './discounts/discounts.module';

@Module({
  imports: [AuthModule, ProductsModule, CategoriesModule, OrdersModule, PaymentsModule, TransactionsModule, ShipmentsModule, StoreModule, SupportModule, UsersModule, ActivitiesModule, ShoppingCartModule, NotificationsModule, DiscountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
