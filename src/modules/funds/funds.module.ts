import { Module } from '@nestjs/common';
import { FundsController } from './funds.controller';
import { ListFundsUseCase } from './application/list-funds.use-case';
import { IFundRepository } from './domain/fund.repository.interface';
import { DynamoFundRepository } from './infrastructure/dynamo-fund.repository';

@Module({
  controllers: [FundsController],
  providers: [
    ListFundsUseCase,
    {
      provide: IFundRepository,
      useClass: DynamoFundRepository,
    },
  ],
  exports: [IFundRepository],
})
export class FundsModule {}
