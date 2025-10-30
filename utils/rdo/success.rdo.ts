import { IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';

export class SuccessRdo {
  @IsBoolean()
  @Expose()
  success: true;
}
