import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignupRequestDto {
  @ApiProperty()
  fullName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
