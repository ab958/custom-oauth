import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { DynamicException } from '../services/exception.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  public readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status: number;
    let message: string;

    if (exception instanceof DynamicException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }
    this.logger.error(message)
    
    response.status(status).json({
      statusCode: status,
      message,
      data: null
    });
  }
}