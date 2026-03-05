import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscribeToFundUseCase } from './application/subscribe-to-fund.use-case';
import { CancelSubscriptionUseCase } from './application/cancel-subscription.use-case';
import { ListActiveSubscriptionsUseCase } from './application/list-active-subscriptions.use-case';
import { ISubscriptionRepository } from './domain/subscription.repository.interface';
import { DynamoSubscriptionRepository } from './infrastructure/dynamo-subscription.repository';
import { UsersModule } from '../users/users.module';
import { FundsModule } from '../funds/funds.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    UsersModule,
    FundsModule,
    TransactionsModule,
    NotificationModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscribeToFundUseCase,
    CancelSubscriptionUseCase,
    ListActiveSubscriptionsUseCase,
    {
      provide: ISubscriptionRepository,
      useClass: DynamoSubscriptionRepository,
    },
  ],
})
export class SubscriptionsModule {}
