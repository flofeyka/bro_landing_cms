import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PageDto {
  @Type(() => Number)
  @IsInt()
  page: number;

  @Type(() => Number)
  @IsInt()
  limit: number;
}
