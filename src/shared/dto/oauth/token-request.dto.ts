import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  client_id: string;

  @IsNotEmpty()
  @ApiProperty()
  client_secret: string;

  @IsNotEmpty()
  @ApiProperty()
  redirect_uri: string;

  @IsNotEmpty()
  @ApiProperty()
  code: string;

}
