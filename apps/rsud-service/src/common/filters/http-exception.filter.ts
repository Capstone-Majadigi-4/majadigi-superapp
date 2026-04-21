import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: any = 'Internal server error';

    if (typeof res === 'object' && res !== null && 'message' in res) {
      message = (res as any).message;
    } else if (exception instanceof HttpException) {
      message = exception.message;
    }

    response.status(status).json({
      status: 'error',
      message: Array.isArray(message) ? message[0] : message,
      data: null,
      code: status,
    });
  }
}
