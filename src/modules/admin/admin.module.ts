import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminListUsersUseCase } from './application/admin-list-users.use-case';
import { AdminListTransactionsUseCase } from './application/admin-list-transactions.use-case';
import { AuthModule } from '../auth/auth.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [AuthModule, TransactionsModule],
  controllers: [AdminController],
  providers: [
    AdminListUsersUseCase,
    AdminListTransactionsUseCase,
  ],
})
export class AdminModule {}
