export default () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  aws: {
    region: process.env.AWS_REGION_NAME || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    dynamoEndpoint: process.env.DYNAMO_ENDPOINT,
  },
  mail: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  dynamo: {
    usersTable: process.env.DYNAMO_USERS_TABLE,
    fundsTable: process.env.DYNAMO_FUNDS_TABLE,
    subscriptionsTable: process.env.DYNAMO_SUBSCRIPTIONS_TABLE,
    transactionsTable: process.env.DYNAMO_TRANSACTIONS_TABLE,
  },
});
