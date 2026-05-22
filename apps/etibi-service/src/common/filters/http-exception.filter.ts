import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import {
  Request,
  Response,
} from 'express';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: any,
    host: ArgumentsHost,
  ) {
    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    const status =
      exception instanceof
      HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: 'error',

      path: request.url,

      message:
        exception?.message ??
        'Internal server error',

      error:
        exception?.name ??
        'INTERNAL_SERVER_ERROR',

      code: status,

      timestamp:
        new Date().toISOString(),
    });
  }
}