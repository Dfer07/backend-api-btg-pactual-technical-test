import { Injectable } from '@nestjs/common';
import { DynamoService } from '../../../database/dynamo.service';
import { IFundRepository } from '../domain/fund.repository.interface';
import { Fund } from '../domain/fund.entity';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoFundRepository implements IFundRepository {
  private readonly tableName: string;

  constructor(private dynamoService: DynamoService) {
    this.tableName = this.dynamoService.getTableName('fundsTable');
  }

  async findAll(): Promise<Fund[]> {
    const result = await this.dynamoService.getDocumentClient().send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );
    return (result.Items as Fund[]) || [];
  }

  async findById(fundId: string): Promise<Fund | null> {
    const result = await this.dynamoService.getDocumentClient().send(
      new GetCommand({
        TableName: this.tableName,
        Key: { fundId },
      }),
    );
    return (result.Item as Fund) || null;
  }
}
