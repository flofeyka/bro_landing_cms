import { PageDto } from '../../../utils/dto/page.dto';
import { IsOptional, IsString } from 'class-validator';

export class FetchTextsDto extends PageDto {
  @IsString()
  @IsOptional()
  search?: string;
}
