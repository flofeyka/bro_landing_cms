import { Injectable } from '@nestjs/common';
import { SuccessRdo } from 'utils/rdo/success.rdo';
import { SendRequestDto } from './dto/send-request.dto';
import { fillDto } from 'utils/fillDto';
import { MailerService } from '@nestjs-modules/mailer';
import { Resend } from 'resend';

@Injectable()
export class AppService {
  private resend: Resend;

  constructor(private readonly mailerService: MailerService) {
    this.resend = new Resend(process.env.RESEND_KEY);
  }

  async sendRequest(dto: SendRequestDto): Promise<SuccessRdo> {
    await Promise.all([
      await this.resend.emails.send({
        from: 'BroSecurity <onboarding@resend.dev>',
        to: dto.email,
        subject: 'Ваш запрос принят',
        html: `
            <div style="font-family: Arial, sans-serif; color: #222;">
              <h2>Здравствуйте, ${dto.fullName}!</h2>
              <p>Благодарим вас за обращение в <b>BroSecurity</b>.</p>
              <p>Мы уже анализируем ваш запрос и скоро свяжемся с вами.</p>
              <p style="margin-top: 20px;">С уважением,<br/>Команда BroSecurity</p>
              <a href="https://brosecurity.xyz" 
                style="display:inline-block;margin-top:16px;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
                Перейти на сайт
              </a>
            </div>
          `,
      }),

      // 2️⃣ Письмо оператору
      await this.resend.emails.send({
        from: 'BroSecurity <onboarding@resend.dev>',
        to: 'info@brosecurity.xyz',
        subject: 'Новая заявка с сайта',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h3>Новая заявка с сайта BroSecurity</h3>
              <p><b>Имя:</b> ${dto.fullName}</p>
              <p><b>Email:</b> ${dto.email}</p>
              <p><b>Сообщение:</b> ${dto.message}</p>
              <p><b>Способ связи:</b> ${dto.communicationWay}</p>
              <p><b>Контакт:</b> ${dto.communicationValue}</p>
            </div>
          `,
      }),
    ]);

    return fillDto(SuccessRdo, { success: true });
  }
}
