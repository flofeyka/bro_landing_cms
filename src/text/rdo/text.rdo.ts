import { Language } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class TextRdo {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  code: string;

  @IsString()
  @Expose()
  value: string;

  @IsString()
  @Expose()
  language: Language;

  @IsString()
  @Expose()
  source: 'database' | 'original';
}
