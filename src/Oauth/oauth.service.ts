import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App } from '../App/schemas/app.schemas';
import { AuthorizationCode } from './schemas/authorization-code.schema';
import * as crypto from 'crypto';
import { DynamicException } from 'src/shared/services/exception.service';
import { UserAccountService } from 'src/UserAccount/userAccount.service';

@Injectable()
export class OAuthService {
  constructor(
    @InjectModel(App.name) private appModel: Model<App>,
    @InjectModel(AuthorizationCode.name) private authCodeModel: Model<AuthorizationCode>,
    private readonly userAccountService: UserAccountService
  ) {}

  async validateClient(clientId: string, redirectUri: string): Promise<App> {
    const app = await this.appModel.findOne({ clientId });
    if (!app || !app.redirectUri.includes(redirectUri)) {
      throw new DynamicException(`App not found`, HttpStatus.NOT_FOUND);
    }
    return app;
  }

  async createAuthorizationCode(client_id: string,userId: any) {
    const authorizationCode = crypto.randomBytes(20).toString('hex');
    
    await this.authCodeModel.create({
      code: authorizationCode,
      clientId: client_id,
      user: userId
    });

    return authorizationCode;
  }

  async exchangeCodeForToken(clientId: string, authorizationCode: string, clientSecret: string, redirectUri: string) {
    const authData = await this.authCodeModel.findOne({ code: authorizationCode });

    if (!authData || authData.clientId !== clientId) {
      throw new DynamicException(`Wrong Code`, HttpStatus.NOT_FOUND);
    }

    // await this.authCodeModel.deleteOne({ code: authorizationCode });

    const accessToken = this.userAccountService.createToken(authData.user);

    return {
      access_token: accessToken,
      message: 'User Signup SuccessFully',
    };
  }
}
