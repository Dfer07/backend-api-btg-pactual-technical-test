import { Transaction } from './transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findAll(): Promise<Transaction[]>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');
