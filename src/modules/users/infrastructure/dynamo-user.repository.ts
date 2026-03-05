import { Injectable } from '@nestjs/common';
import { DynamoService } from '../../../database/dynamo.service';
import { IUserRepository } from '../domain/user.repository.interface';
import { User } from '../domain/user.entity';
import { PutCommand, GetCommand, QueryCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoUserRepository implements IUserRepository {
  private readonly tableName: string;

  constructor(private dynamoService: DynamoService) {
    this.tableName = this.dynamoService.getTableName('usersTable');
  }

  async save(user: User): Promise<void> {
    await this.dynamoService.getDocumentClient().send(
      new PutCommand({
        TableName: this.tableName,
        Item: user,
      }),
    );
  }

  async findById(userId: string): Promise<User | null> {
    const result = await this.dynamoService.getDocumentClient().send(
      new GetCommand({
        TableName: this.tableName,
        Key: { userId },
      }),
    );
    return (result.Item as User) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.dynamoService.getDocumentClient().send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      }),
    );
    return (result.Items?.[0] as User) || null;
  }

  async updateBalance(userId: string, newBalance: number): Promise<void> {
    await this.dynamoService.getDocumentClient().send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { userId },
        UpdateExpression: 'set balance = :balance, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':balance': newBalance,
          ':updatedAt': new Date().toISOString(),
        },
      }),
    );
  }

  async updateNotificationPreference(userId: string, preference: string): Promise<void> {
    await this.dynamoService.getDocumentClient().send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { userId },
        UpdateExpression: 'set notificationPreference = :pref, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':pref': preference,
          ':updatedAt': new Date().toISOString(),
        },
      }),
    );
  }

  async findAll(): Promise<User[]> {
    const result = await this.dynamoService.getDocumentClient().send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );
    return (result.Items as User[]) || [];
  }
}
