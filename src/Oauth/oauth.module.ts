import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from 'src/App/schemas/app.schemas';
import { AuthorizationCode, AuthorizationCodeSchema } from './schemas/authorization-code.schema';
import { UserAccountModule } from 'src/UserAccount/userAccount.module';
import { UserAccountService } from 'src/UserAccount/userAccount.service';
import { UserProfileService } from 'src/UserProfile/userProfile.service';
import { User, UserSchema } from 'src/UserProfile/schemas/user.schemas';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
    MongooseModule.forFeature([{ name: AuthorizationCode.name, schema: AuthorizationCodeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserAccountModule
  ],
  controllers: [OAuthController],
  providers: [OAuthService, UserAccountService, UserProfileService],
  exports: [],
})
export class OauthModule {}
