import { Controller, Get, Post, Query, Body, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { OAuthService } from './oauth.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';

@Controller('oauth')
@ApiTags('Oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get('authorize')
  @Auth()
  async authorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('code_challenge') codeChallenge: string,
    @Query('code_challenge_method') codeChallengeMethod: string,
    @Query('scope') scope: string,
    @Res() res: Response,
    @Req() req: any
  ) {
    const userId = req.user.userId;
    await this.oauthService.validateClient(clientId, redirectUri);
    
    const authorizationCode = await this.oauthService.createAuthorizationCode(clientId, codeChallenge, codeChallengeMethod, scope, userId);

    res.redirect(`${redirectUri}?code=${authorizationCode}`);
  }

  @Post('token')
  async token(
    @Body('client_id') clientId: string,
    @Body('grant_type') grantType: string,
    @Body('code') authorizationCode: string,
    @Body('redirect_uri') redirectUri: string,
    @Body('code_verifier') codeVerifier: string,
    @Res() res: Response,
  ) {
    if (grantType !== 'authorization_code') {
      return res.status(400).json({ error: 'Unsupported grant type' });
    }

    return await this.oauthService.exchangeCodeForToken(clientId, authorizationCode, codeVerifier, redirectUri);
  }
}
