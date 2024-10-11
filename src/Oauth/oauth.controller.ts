import { Controller, Get, Post, Query, Body, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { OAuthService } from './oauth.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UserAccountService } from 'src/UserAccount/userAccount.service';
import { TokenRequestDto } from 'src/shared/dto';

@Controller('oauth')
@ApiTags('Oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly userAccountService: UserAccountService

  ) { }

  @Get('consent')
  async consent(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('responseType') responseType: string,
    @Query('scope') scope: string,
    @Res() res: Response
  ) {
    const app = await this.oauthService.validateClient(clientId, redirectUri);
    const applicationName = app.name;

    res.render('oauth_consent', {
      applicationName,
      clientId,
      redirectUri,
      responseType,
      scope,
    });
  }

  @Get('login')
  async login(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('responseType') responseType: string,
    @Query('scope') scope: string,
    @Res() res: Response
  ) {
    await this.oauthService.validateClient(clientId, redirectUri);
    res.render('login',
      {
        clientId,
        redirectUri,
        responseType,
        scope,
      }
    );
  }

  @Post('login')
  async postLogin(
    @Res() res: Response,
    @Body() body: any) 
    {
      const {
        client_id,
        redirect_uri,
        response_type,
        scope,
        username,
        password
      } = body;


    await this.oauthService.validateClient(client_id, redirect_uri);
    const user = await this.userAccountService.signIn({email: username, password})
    const createAuthorizationCode = await this.oauthService.createAuthorizationCode(client_id,user.user._id);

    res.redirect(`${redirect_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&responseType=${response_type}&scope=${scope}&code=${createAuthorizationCode}`);
  }



  @Get('authorize')
  async authorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('responseType') responseType: string,
    @Query('scope') scope: string,
    @Res() res: Response,
  ) {
    await this.oauthService.validateClient(clientId, redirectUri);
    res.redirect(`/oauth/consent?client_id=${clientId}&redirect_uri=${redirectUri}&responseType=${responseType}&scope=${scope}`);
  }

  @Post('token')
  async token(
    @Body() tokenRequestDto: TokenRequestDto
  ) {
    const clientId = tokenRequestDto.client_id;
    const authorizationCode = tokenRequestDto.code;
    const clientSecret = tokenRequestDto.client_secret;
    const redirectUri = tokenRequestDto.redirect_uri;
    return  await this.oauthService.exchangeCodeForToken(clientId, authorizationCode, clientSecret, redirectUri);
  }
}
