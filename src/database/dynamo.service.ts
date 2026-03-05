import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoService implements OnModuleInit {
  private client!: DynamoDBClient;
  private documentClient!: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const region = this.configService.get<string>('aws.region');
    const endpoint = this.configService.get<string>('aws.dynamoEndpoint');
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey');

    const config: any = { region };

    if (endpoint) {
      config.endpoint = endpoint;
      // Sólo usamos credenciales manuales si hay un endpoint (ej: DynamoDB Local)
      if (accessKeyId && secretAccessKey) {
        config.credentials = {
          accessKeyId,
          secretAccessKey,
        };
      }
    }
    // En AWS Lambda, no pasamos 'credentials'; el SDK las toma automáticamente del Rol de Ejecución.

    this.client = new DynamoDBClient(config);
    this.documentClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  getDocumentClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }

  getTableName(key: string): string {
    return this.configService.get<string>(`dynamo.${key}`)!;
  }
}
