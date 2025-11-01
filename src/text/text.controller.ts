import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { TextRdo } from './rdo/text.rdo';
import { TextService } from './text.service';
import { Language } from '@prisma/client';
import { TextsRdo } from './rdo/texts.rdo';
import { ResetTextDto } from './dto/reset-text.dto';
import { FetchTextsDto } from './dto/fetch-texts.dto';
import { SuccessRdo } from '../../utils/rdo/success.rdo';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createText(@Body() dto: CreateTextDto): Promise<TextRdo> {
    return this.textService.createText(dto);
  }

  @Delete('/:language/:code')
  @UseGuards(JwtAuthGuard)
  resetValue(@Param() dto: ResetTextDto): Promise<SuccessRdo> {
    return this.textService.resetText(dto.language, dto.code);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getValueByValueOrKey(@Query() dto: FetchTextsDto): Promise<TextsRdo> {
    return this.textService.getTextsByValueOrKey(
      dto.search,
      dto.page,
      dto.limit,
    );
  }

  @Get('/:language')
  async translate(@Param('language') lng: 'ru' | 'en'): Promise<object> {
    return await this.textService.getTexts(lng.toUpperCase() as Language);
  }
}
