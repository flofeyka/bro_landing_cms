import { Language } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateTextDto {
  @IsString()
  code: string;

  @IsString()
  value: string;

  @IsEnum(Language)
  language: Language;
}
