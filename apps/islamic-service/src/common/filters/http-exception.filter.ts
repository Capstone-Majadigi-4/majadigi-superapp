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

    const isHttp = exception instanceof HttpException;
    const errStatus = typeof (exception as any)?.status === 'number'
      ? (exception as any).status
      : null;

    const status = isHttp
      ? exception.getStatus()
      : (errStatus ?? HttpStatus.INTERNAL_SERVER_ERROR);

    const message = isHttp
      ? ((exception.getResponse() as any)?.message ?? (exception as Error).message)
      : ((exception as Error)?.message ?? 'Internal server error');

    response.status(status).json({
      status: 'error',
      message: Array.isArray(message) ? message[0] : message,
      data: null,
      code: status,
    });
  }
}
