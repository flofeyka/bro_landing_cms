import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Language } from '@prisma/client';

import * as ruLocale from './locales/ru.json';
import * as enLocale from './locales/en.json';
import { CreateTextDto } from './dto/create-text.dto';
import { TextRdo } from './rdo/text.rdo';
import { fillDto } from 'utils/fillDto';
import { TextsRdo } from './rdo/texts.rdo';
import { v4 as uuidv4 } from 'uuid';
import { SuccessRdo } from '../../utils/rdo/success.rdo';

@Injectable()
export class TextService {
  private locales: Map<string, any> = new Map();

  constructor(private readonly prisma: PrismaService) {
    this.loadLocales();
  }

  /**
   * Формирует JSON объект переводов для i18next
   */
  async getTexts(language: Language): Promise<object> {
    const dbTexts = await this.prisma.text.findMany({
      where: { language },
    });

    const result: object = this.locales.get(language.toLowerCase());

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

    const result: object = this.locales.get(language.toLowerCase());
    this.setNestedValue(result, text.code, text.value);
    return fillDto(TextRdo, text);
  }

  async resetText(language: Language, code: string): Promise<SuccessRdo> {
    try {
      await this.prisma.text.delete({
        where: { code_language: { language, code } },
      });

      const result = this.locales.get(language.toLowerCase());
      const value = this.getValueFromLocale(language, code);
      this.setNestedValue(result, code, value);

      return fillDto(SuccessRdo, { success: true });
    } catch (e) {
      console.error('Cannot delete the text:', e);
      throw new NotFoundException('Text not found');
    }
  }

  async getTextsByValueOrKey(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TextsRdo> {
    const skip = (page - 1) * limit;

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

    for (const text of dbTexts) {
      const key = `${text.code}_${text.language}`;
      resultMap.set(key, {
        id: text.id,
        code: text.code,
        value: text.value,
        language: text.language,
        source: 'database',
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
            source: 'original',
          });
        }
      }
    }

    const values = Array.from(resultMap.values());

    const fullList = values
      .filter(
        (val, index) =>
          index ===
          values.findIndex(
            (t) => t.code === val.code && t.language === val.language,
          ),
      )
      .filter((val) => {
        const searchTerm = search || '';
        return (
          val.code
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          val.value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

    const paginatedList = fullList.slice(skip, skip + limit);

    return fillDto(TextsRdo, {
      texts: paginatedList,
      total: fullList.length,
    });
  }

  private loadLocales(): void {
    this.locales.set('ru', structuredClone(ruLocale));
    this.locales.set('en', structuredClone(enLocale));
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

  private getValueFromLocale(language: Language, code: string): string {
    type Locale = {
      [key: string]: string | { [key: string]: any };
    };

    // Получаем начальный объект с правильным типом
    const initialLocale: Locale =
      language === Language.RU ? ruLocale : enLocale;

    // Разбиваем код на ключи
    const keys = code.split('.');
    let value: Locale | string = initialLocale;

    // Итерируемся по ключам
    for (const key of keys) {
      // Проверяем существование ключа
      if (typeof value === 'object' && value !== null && key in value) {
        value = value[key];
      } else {
        throw new Error(`Ключ ${key} не найден в локации`);
      }
    }

    // Убеждаемся, что результат - строка
    if (typeof value !== 'string') {
      throw new Error('Полученное значение не является строкой');
    }

    return value;
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
