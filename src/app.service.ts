import { Injectable } from '@nestjs/common';
import { SuccessRdo } from 'utils/rdo/success.rdo';
import { SendRequestDto } from './dto/send-request.dto';
import { fillDto } from 'utils/fillDto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRequest(dto: SendRequestDto): Promise<SuccessRdo> {
    await Promise.all([
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Ваш запрос принят',
        text: `Здравствуйте, ${dto.fullName}! Благодарим за ваше обращение. Мы уже анализируем ваш запрос и скоро свяжемся с вами.`,
      }),

      await this.mailerService.sendMail({
        to: 'info@brosecurity.xyz',
        subject: 'Новая заявка с сайта',
        html: `
            <h3>Новая заявка</h3>
            <p><b>Имя:</b> ${dto.fullName}</p>
            <p><b>Email:</b> ${dto.email}</p>
            <p><b>Сообщение:</b> ${dto.message}</p>
            <p><b>Способ связи:</b> ${dto.communicationWay}</p>
            <p><b>Контакт:</b> ${dto.communicationValue}</p>
          `,
      }),
    ]);

    return fillDto(SuccessRdo, { success: true });
  }
}
