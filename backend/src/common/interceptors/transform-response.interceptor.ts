import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((res) => {
        if (
          res &&
          typeof res === 'object' &&
          'statusCode' in res &&
          'success' in res &&
          'message' in res &&
          'data' in res
        ) {
          return res;
        }

        if (
          res &&
          typeof res === 'object' &&
          'message' in res &&
          'data' in res
        ) {
          return {
            statusCode,
            success: true,
            message: res.message,
            data: res.data,
          };
        }

        let message = 'Operasi berhasil';
        let data = res;

        if (res && typeof res === 'object' && 'message' in res && !('data' in res)) {
          const { message: msg, ...rest } = res;
          message = msg;
          data = Object.keys(rest).length > 0 ? rest : null;
        }

        return {
          statusCode,
          success: true,
          message,
          data,
        };
      }),
    );
  }
}
