import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../domain/transaction.repository.interface';

@Injectable()
export class GetTransactionHistoryUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string) {
    return this.transactionRepository.findByUserId(userId);
  }
}
