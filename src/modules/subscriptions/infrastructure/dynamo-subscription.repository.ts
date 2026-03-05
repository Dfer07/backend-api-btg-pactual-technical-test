import { Injectable } from '@nestjs/common';
import { DynamoService } from '../../../database/dynamo.service';
import { ISubscriptionRepository } from '../domain/subscription.repository.interface';
import { Subscription } from '../domain/subscription.entity';
import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SubscriptionStatus } from '../../../common/enums/project.enums';

@Injectable()
export class DynamoSubscriptionRepository implements ISubscriptionRepository {
  private readonly tableName: string;

  constructor(private dynamoService: DynamoService) {
    this.tableName = this.dynamoService.getTableName('subscriptionsTable');
  }

  async save(subscription: Subscription): Promise<void> {
    await this.dynamoService.getDocumentClient().send(
      new PutCommand({
        TableName: this.tableName,
        Item: subscription,
      }),
    );
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const result = await this.dynamoService.getDocumentClient().send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      }),
    );
    return (result.Items as Subscription[]) || [];
  }

  async findActiveByUserIdAndFundId(userId: string, fundId: string): Promise<Subscription | null> {
    const result = await this.dynamoService.getDocumentClient().send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'userId = :userId AND fundId = :fundId',
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':userId': userId,
          ':fundId': fundId,
          ':status': SubscriptionStatus.ACTIVE,
        },
      }),
    );
    return (result.Items?.[0] as Subscription) || null;
  }

  async update(subscription: Subscription): Promise<void> {
    // En este caso DynamoDB PutCommand con la misma PK/SK sobreescribe (útil para cambios de estado)
    await this.save(subscription);
  }
}
