import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  message: string;

  @IsEnum(CommunicationWay)
  communicationWay: CommunicationWay;

  @IsString()
  communicationValue: string;
}
