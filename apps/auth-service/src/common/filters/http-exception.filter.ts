import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Terjadi kesalahan di sisi server';
        let error = 'INTERNAL_SERVER_ERROR';

        if(exception instanceof HttpException){
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
    
            if(typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const res = exceptionResponse as Record<string, unknown>;
                message = (res.message as string) || message;
                
                if(Array.isArray(res.message)){
                    message = (res.message as string[]).join(', ');
                }
            } else {
                message = exceptionResponse as string;
            }

            const errorMap: Record<number, string> = {
                400: 'BAD_REQUEST',
                401: 'UNAUTHORIZED',
                403: 'FORBIDDEN',
                404: 'NOT_FOUND',
                409: 'CONFLICT',
                422: 'UNPROCESSABLE_ENTITY',
                500: 'INTERNAL_SERVER_ERROR',
            };
            error = errorMap[status] ?? 'UNKNOWN_ERROR';

        }

        response.status(status).json({
          status: 'error',
          message,
          error,
          code: status,
        });
    }
}