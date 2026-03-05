import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config();

const INITIAL_FUNDS = [
  { fundId: "1", name: "FPV_BTG_PACTUAL_RECAUDADORA", minimumAmount: 75000, category: "FPV" },
  { fundId: "2", name: "FPV_BTG_PACTUAL_ECOPETROL", minimumAmount: 125000, category: "FPV" },
  { fundId: "3", name: "DEUDAPRIVADA", minimumAmount: 50000, category: "FIC" },
  { fundId: "4", name: "FDO-ACCIONES", minimumAmount: 250000, category: "FIC" },
  { fundId: "5", name: "FPV_BTG_PACTUAL_DINAMICA", minimumAmount: 100000, category: "FPV" },
];

import bcrypt from 'bcrypt';

async function seed() {
  const region = process.env.AWS_REGION_NAME || 'us-east-1';
  const fundsTable = process.env.DYNAMO_FUNDS_TABLE || 'btg-funds-dev';
  const usersTable = process.env.DYNAMO_USERS_TABLE || 'btg-users-dev';
  const endpoint = process.env.DYNAMO_ENDPOINT;

  const config: any = { region };
  if (endpoint) config.endpoint = endpoint;

  const client = new DynamoDBClient(config);
  const docClient = DynamoDBDocumentClient.from(client);

  // 1. Seed Funds
  console.log(`Seeding table: ${fundsTable}...`);
  for (const fund of INITIAL_FUNDS) {
    try {
      await docClient.send(
        new PutCommand({
          TableName: fundsTable,
          Item: {
            ...fund,
            createdAt: new Date().toISOString(),
          },
        }),
      );
      console.log(`Fund seeded: ${fund.name}`);
    } catch (error) {
      console.error(`Error seeding fund ${fund.name}:`, error);
    }
  }

  // 2. Seed Admin User
  console.log(`Seeding Admin User in ${usersTable}...`);
  try {
    const adminPassword = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await docClient.send(
      new PutCommand({
        TableName: usersTable,
        Item: {
          userId: 'admin-001',
          email: 'admin@btgpactual.com',
          fullName: 'Administrador de Sistema',
          passwordHash: hashedPassword,
          phone: '+0000000000',
          role: 'ADMIN',
          balance: 0,
          notificationPreference: 'EMAIL',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    );
    console.log('--- ADMIN USER CREATED ---');
    console.log('Email: admin@btgpactual.com');
    console.log(`Password: ${adminPassword}`);
    console.log('--------------------------');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }

  console.log('Seeding completed!');
}

seed().catch(console.error);
