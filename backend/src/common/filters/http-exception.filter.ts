import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan internal pada server.';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        if (Array.isArray(resObj.message)) {
          message = resObj.message[0] || 'Validasi gagal';
          errors = resObj.message;
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        } else if (resObj.error) {
          message = resObj.error;
        }

        if (resObj.errors) {
          errors = resObj.errors;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      errors: errors ?? null,
      timestamp: new Date().toISOString(),
    });
  }
}
