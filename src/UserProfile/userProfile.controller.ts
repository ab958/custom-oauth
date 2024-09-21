import {
  Controller,
  Get,
  Req,
} from '@nestjs/common';
import { UserProfileService } from './userProfile.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';

@Controller('user')
@ApiTags('User Profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('info')
  @Auth()
  getAllUser(@Req() req: any) {
    return this.userProfileService.getUserById(req.user.userId);
  }
}
