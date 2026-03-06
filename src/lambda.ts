import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { configure as serverlessExpress } from "@vendia/serverless-express";
import { Callback, Context, Handler } from "aws-lambda";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  // app.setGlobalPrefix('api/v1'); // Disabled because API Gateway already handles this prefix
  app.use((req: any, res: any, next: any) => {
    if (req.path === "/api/v1" || req.path === "/api/v1/") {
      req.url = "/";
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  try {
    server = server ?? (await bootstrap());
    return await server(event, context, callback);
  } catch (error: any) {
    console.error("Bootstrap error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Lambda Bootstrap Error",
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
