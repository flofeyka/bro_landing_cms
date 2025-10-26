import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { TextRdo } from './text.rdo';

export class TextsRdo {
  @IsArray()
  @Expose()
  texts: TextRdo;
}
