import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { GetTransactionHistoryUseCase } from './application/get-transaction-history.use-case';
import { ITransactionRepository } from './domain/transaction.repository.interface';
import { DynamoTransactionRepository } from './infrastructure/dynamo-transaction.repository';

@Module({
  controllers: [TransactionsController],
  providers: [
    GetTransactionHistoryUseCase,
    {
      provide: ITransactionRepository,
      useClass: DynamoTransactionRepository,
    },
  ],
  exports: [ITransactionRepository],
})
export class TransactionsModule {}
