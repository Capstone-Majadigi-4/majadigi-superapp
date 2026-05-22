import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    console.error(exception);

    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    let status =
      HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      'Internal server error';

    let error =
      'INTERNAL_SERVER_ERROR';

    if (
      exception instanceof HttpException
    ) {
      status =
        exception.getStatus();

      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse ===
        'object'
      ) {
        const res =
          exceptionResponse as any;

        message =
          res.message || message;

        error =
          res.error || error;
      } else {
        message =
          exceptionResponse as string;
      }
    }

    response.status(status).json({
      status: 'error',

      path: request.url,

      message,

      error,

      code: status,

      timestamp:
        new Date().toISOString(),
    });
  }
}