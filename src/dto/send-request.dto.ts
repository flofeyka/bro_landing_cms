import { IsEmail, IsEnum, IsString } from 'class-validator';

enum CommunicationWay {
  telegram = 'TELEGRAM',
  whatsapp = 'WHATSAPP',
}

export class SendRequestDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  message: string;

  @IsEnum(CommunicationWay)
  communicationWay: CommunicationWay;

  @IsString()
  communicationValue: string;
}
