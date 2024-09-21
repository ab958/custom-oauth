import { Body, Controller, Post } from '@nestjs/common';
import { UserAccountService } from './userAccount.service';
import { SignInRequestDto, SignupRequestDto } from 'src/shared/dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Auth')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post('sign-up')
  async signUp(@Body() signupRequest: SignupRequestDto) {
    return await this.userAccountService.signUp(signupRequest);
  }

  @Post('sign-in')
  async signIn(@Body() signupRequest: SignInRequestDto) {
    return await this.userAccountService.signIn(signupRequest);
  }
}
