import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../transactions/domain/transaction.repository.interface';

@Injectable()
export class AdminListTransactionsUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute() {
    return this.transactionRepository.findAll();
  }
}
