import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserAccountService } from 'src/UserAccount/userAccount.service';
import { DynamicException } from '../services/exception.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly authService: UserAccountService,
    private readonly reflector?: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isApiBearerAuth = this.reflector.getAllAndOverride<boolean>(
      'authenticatedOnly',
      [context.getHandler(), context.getClass()],
    );

    if (isApiBearerAuth) {
      try {
        const token = this.getToken(context);
        const user = await this.authService.verifyToken(token);

        this.appendUser({ userId: user._id, ...user }, context);
      } catch (err) {
        if (!err.failedAssertion) {
          this.logger.error(err);
          throw err
        } else {
          this.logger.error('Invalid token provided');
        }
        throw new DynamicException('Invalid token provided.', HttpStatus.UNAUTHORIZED);
      }
      return true;
    }

    // If `@ApiBearerAuth()` is not present, allow access
    return true;
  }

  private getToken(context: ExecutionContext) {
    let authorization: string;
    authorization = context
      .switchToHttp()
      .getRequest()
      .headers?.authorization?.replace('Bearer ', '');
    if (!authorization) {
      throw new DynamicException('No value was provided for Authorization', HttpStatus.UNAUTHORIZED);
    }
    return authorization;
  }

  private appendUser(user: any, context: ExecutionContext) {
    context.switchToHttp().getRequest().user = user;
  }
}
