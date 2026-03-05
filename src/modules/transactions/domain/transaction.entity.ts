import { TransactionType } from '../../../common/enums/project.enums';

export class Transaction {
  constructor(
    public readonly userId: string,
    public readonly transactionId: string,
    public readonly type: TransactionType,
    public readonly fundId: string,
    public readonly fundName: string,
    public readonly amount: number,
    public readonly balanceBefore: number,
    public readonly balanceAfter: number,
    public readonly createdAt: string,
  ) {}

  static create(
    userId: string,
    transactionId: string,
    type: TransactionType,
    fundId: string,
    fundName: string,
    amount: number,
    balanceBefore: number,
    balanceAfter: number,
  ): Transaction {
    return new Transaction(
      userId,
      transactionId,
      type,
      fundId,
      fundName,
      amount,
      balanceBefore,
      balanceAfter,
      new Date().toISOString(),
    );
  }
}
