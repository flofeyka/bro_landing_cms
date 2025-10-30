import { Expose } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';
import { TextRdo } from './text.rdo';

export class TextsRdo {
  @IsArray()
  @Expose()
  texts: TextRdo;

  @IsInt()
  @Expose()
  total: number;
}
