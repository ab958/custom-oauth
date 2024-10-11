import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/favicon.ico')
  ignoreFavicon(@Res() res: Response) {
    res.status(204).end();  // Send no content response to favicon request
  }
}