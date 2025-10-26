import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Language } from '@prisma/client';

import * as ruLocale from './locales/ru.json';
import * as enLocale from './locales/en.json';
import { CreateTextDto } from './dto/create-text.dto';
import { TextRdo } from './rdo/text.rdo';
import { fillDto } from 'utils/fillDto';
import { TextsRdo } from './rdo/texts.rdo';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TextService {
  private locales: Map<string, any> = new Map();
  defaultLocale = 'ru';

  constructor(private readonly prisma: PrismaService) {
    this.loadLocales();
  }

  private loadLocales(): void {
    this.locales.set('ru', ruLocale);
    this.locales.set('en', enLocale);
  }

  /**
   * Формирует JSON объект переводов для i18next
   */
  async getTexts(language: Language): Promise<object> {
    const dbTexts = await this.prisma.text.findMany({
      where: { language },
    });

    const result = this.locales.get(language.toLowerCase());

    for (const text of dbTexts) {
      this.setNestedValue(result, text.code, text.value);
    }

    return result;
  }

  async createText(data: CreateTextDto): Promise<TextRdo> {
    const { code, language, value } = data;
    const text = await this.prisma.text.upsert({
      where: { code_language: { code, language } },
      create: { code, language, value },
      update: { value },
    });
    return fillDto(TextRdo, text);
  }

  async getTextsByValueOrKey(
    search: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TextsRdo> {
    const skip = (page - 1) * limit;

    // Получаем все записи из базы данных по поисковому запросу
    const dbTexts = await this.prisma.text.findMany({
      where: {
        OR: [
          {
            code: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            value: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const resultMap = new Map<string, TextRdo>();

    // Добавляем все записи из базы данных в resultMap
    for (const text of dbTexts) {
      const key = `${text.code}_${text.language}`;
      resultMap.set(key, {
        id: text.id,
        code: text.code,
        value: text.value,
        language: text.language,
      });
    }

    // Добавляем отсутствующие данные из локалей
    for (const [language, locale] of this.locales.entries()) {
      const flat = this.flatten(locale);

      for (const [code, value] of flat) {
        const key = `${code}_${language}`;
        if (!resultMap.has(key)) {
          resultMap.set(key, {
            id: uuidv4(), // генерируем ID для виртуальных записей
            code,
            value,
            language: language.toUpperCase() as Language,
          });
        }
      }
    }

    const values = Array.from(resultMap.values());

    // П реобразуем map в массив
    const fullList = values.filter(
      (val, index) =>
        index ===
        values.findIndex(
          (t) => t.code === val.code && t.language === val.language,
        ),
    );

    // Получаем общее количество записей для расчета количества страниц
    const totalRecords = fullList.length;

    // Пагинируем fullList, ограничивая его по лимиту и смещению (skip)
    const paginatedList = fullList.slice(skip, skip + limit);

    // Рассчитываем общее количество страниц
    const totalPages = Math.ceil(totalRecords / limit);

    return fillDto(TextsRdo, {
      texts: paginatedList,
      page,
      totalPages,
      totalRecords,
    });
  }

  /**
   * Превращает строку вида "hero.crypto_operations" в вложенный объект
   */
  private setNestedValue(obj: any, path: string, value: string): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }

  private flatten(obj: any, prefix = ''): [string, string][] {
    const result: [string, string][] = [];

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        result.push(...this.flatten(value, fullKey));
      } else {
        result.push([fullKey, value]);
      }
    }

    return result;
  }
}
