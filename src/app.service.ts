import { Injectable } from '@nestjs/common';
import { SuccessRdo } from 'utils/rdo/success.rdo';
import { SendRequestDto } from './dto/send-request.dto';
import { fillDto } from 'utils/fillDto';

@Injectable()
export class AppService {
  async sendRequest(dto: SendRequestDto): Promise<SuccessRdo> {
    console.log(dto);
    return fillDto(SuccessRdo, { success: true });
  }
}
