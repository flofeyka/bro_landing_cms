import { IsEnum, IsString } from 'class-validator';
import { Language } from '@prisma/client';

export class ResetTextDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  code: string;
}
