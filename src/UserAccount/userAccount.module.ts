import { Module } from '@nestjs/common';
import { UserAccountController } from './userAccount.controller';
import { UserAccountService } from './userAccount.service';
import { JwtModule } from '@nestjs/jwt';
import { UserProfileModule } from 'src/UserProfile/userProfile.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'test',
      signOptions: { expiresIn: '3600s' },
    }),
    UserProfileModule,
  ],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService],
})
export class UserAccountModule {}
