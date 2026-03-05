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

    response.status(status).json({
      statusCode: status,
      message: normalizedMessage,
      error_detail: (exception as any).message,
      stack: (exception as any).stack,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
