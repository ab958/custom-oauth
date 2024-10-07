import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.switchToHttp().getRequest();
    const reqUrl = req.url;
    const response = context.switchToHttp().getResponse();
    if (reqUrl.includes('/authorize')) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => {
      response.statusCode = data.statusCode || 200;
      data.statusCode = response.statusCode;
      const message = data.message;

      delete data.message;
      delete data.statusCode;

      if (Object.keys(data).length === 0) {
        data = null
      }
      return {
        data,
        statusCode: response.statusCode,
        message
      }
    }));
  }
}
