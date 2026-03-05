import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as any)?.message || 'Internal server error';

    const normalizedMessage = typeof message === 'object' 
      ? (message as any).message || (message as any).error || JSON.stringify(message)
      : message;

    const isDev = process.env.NODE_ENV === 'development';

    response.status(status).json({
      statusCode: status,
      message: normalizedMessage,
      error_detail: isDev ? (exception as any).message : undefined,
      stack: isDev ? (exception as any).stack : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
