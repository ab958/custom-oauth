import { Module } from '@nestjs/common';
import { UserAccountModule } from './UserAccount/userAccount.module';
import { UserProfileModule } from './UserProfile/userProfile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './shared/interceptor/transform.interceptor';
import { AuthGuard } from './shared/guards/auth.guard';
import { ApplicationModule } from './App/app.module';
import { OauthModule } from './Oauth/oauth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    UserAccountModule,
    UserProfileModule,
    ApplicationModule,
    OauthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
