import { HttpException, HttpStatus } from '@nestjs/common';

export class DynamicException extends HttpException {
  constructor(message: string, status: number = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}