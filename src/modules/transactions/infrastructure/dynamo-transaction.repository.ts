import { Injectable } from '@nestjs/common';
import { DynamoService } from '../../../database/dynamo.service';
import { ITransactionRepository } from '../domain/transaction.repository.interface';
import { Transaction } from '../domain/transaction.entity';
import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoTransactionRepository implements ITransactionRepository {
  private readonly tableName: string;

  constructor(private dynamoService: DynamoService) {
    this.tableName = this.dynamoService.getTableName('transactionsTable');
  }

  async save(transaction: Transaction): Promise<void> {
    await this.dynamoService.getDocumentClient().send(
      new PutCommand({
        TableName: this.tableName,
        Item: transaction,
      }),
    );
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const result = await this.dynamoService.getDocumentClient().send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        ScanIndexForward: false, // Descendente (más recientes primero)
      }),
    );
    return (result.Items as Transaction[]) || [];
  }

  async findAll(): Promise<Transaction[]> {
    const result = await this.dynamoService.getDocumentClient().send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );
    return (result.Items as Transaction[]) || [];
  }
}
