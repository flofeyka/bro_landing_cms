import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { TextRdo } from './rdo/text.rdo';
import { TextService } from './text.service';
import { Language } from '@prisma/client';
import { TextsRdo } from './rdo/texts.rdo';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  createText(@Body() dto: CreateTextDto): Promise<TextRdo> {
    return this.textService.createText(dto);
  }

  @Get('/')
  getValueByValueOrKey(@Query('search') search: string): Promise<TextsRdo> {
    return this.textService.getTextsByValueOrKey(search);
  }

  @Get('/:language')
  async translate(@Param('language') lng: 'ru' | 'en') {
    const language = lng.toUpperCase() as Language;

    const result = await this.textService.getTexts(language);
    return result;
  }
}
