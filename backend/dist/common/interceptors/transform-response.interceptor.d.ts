import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}
export declare class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>>;
}
