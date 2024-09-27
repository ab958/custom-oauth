import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CreateAppRequestDto, UpdateAppRequestDto } from 'src/shared/dto';

@Controller('app')
@ApiTags('Application')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('create')
  @Auth()
  getAllUser(
    @Body() createAppRequestDto: CreateAppRequestDto,
    @Req() req: any
  ) {
    createAppRequestDto.userId = req.user.userId
    return this.appService.createApp(createAppRequestDto);
  }

  @Get()
  @Auth()
  async getAllApps(@Req() req: any) {
    return this.appService.getAllApps(req.user.userId);
  }

  @Get(':id')
  @Auth()
  async getAppById(@Param('id') id: string) {
    return this.appService.getAppById(id);
  }

  @Patch(':id')
  @Auth()
  async updateApp(
    @Param('id') id: string,
    @Body() updateAppDto: UpdateAppRequestDto,
  ) {
    return this.appService.updateApp(id, updateAppDto);
  }

  @Delete(':id')
  @Auth()
  async deleteApp(
    @Param('id') id: string,
  ) {
    return this.appService.deleteApp(id);
  }
}
