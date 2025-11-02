import { Body, Controller, Post } from '@nestjs/common';
import { SuccessRdo } from 'utils/rdo/success.rdo';
import { AppService } from './app.service';
import { SendRequestDto } from './dto/send-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/request')
  sendRequest(@Body() dto: SendRequestDto): Promise<SuccessRdo> {
    return this.appService.sendRequest(dto);
  }
}
