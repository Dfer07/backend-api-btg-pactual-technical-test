import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { DynamoModule } from './database/dynamo.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FundsModule } from './modules/funds/funds.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';

import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'dev').default('dev'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        AWS_REGION_NAME: Joi.string().required(),
        DYNAMO_USERS_TABLE: Joi.string().required(),
        DYNAMO_FUNDS_TABLE: Joi.string().required(),
        DYNAMO_SUBSCRIPTIONS_TABLE: Joi.string().required(),
        DYNAMO_TRANSACTIONS_TABLE: Joi.string().required(),
        SMTP_HOST: Joi.string().default('smtp.gmail.com'),
        SMTP_PORT: Joi.number().default(465),
        SMTP_USER: Joi.string().email().required(),
        SMTP_PASS: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10, // 10 peticiones por minuto para la prueba
    }]),
    DynamoModule,
    AuthModule,
    UsersModule,
    FundsModule,
    SubscriptionsModule,
    TransactionsModule,
    NotificationModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
