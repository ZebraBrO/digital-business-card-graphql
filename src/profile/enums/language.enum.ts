import { registerEnumType } from '@nestjs/graphql';

/**
 * Язык локализации данных профиля (EN — по умолчанию, RU — русский).
 */
export enum Language {
  EN = 'EN',
  RU = 'RU',
}

registerEnumType(Language, {
  name: 'Language',
  description: 'Язык возвращаемых данных профиля (EN — английский по умолчанию, RU — русский)',
  valuesMap: {
    EN: { description: 'English language (default)' },
    RU: { description: 'Русский язык' },
  },
});

/**
 * Стратегия оптимизации вложенных запросов GraphQL к базе данных (решение проблемы N+1).
 */
export enum OptimizationStrategy {
  DATALOADER = 'DATALOADER',
  AST_JOIN = 'AST_JOIN',
}

registerEnumType(OptimizationStrategy, {
  name: 'OptimizationStrategy',
  description:
    'Стратегия оптимизации вложенных полей GraphQL против проблемы N+1: DATALOADER (батчинг через WHERE profile_id IN) или AST_JOIN (анализ дерева запроса @Info и выборка через Prisma include)',
  valuesMap: {
    DATALOADER: {
      description:
        'Паттерн DataLoader: склеивает запросы дочерних резолверов в рамках одного тика Event Loop в батч-запросы WHERE profile_id IN ($1)',
    },
    AST_JOIN: {
      description:
        'Паттерн AST Lookahead (@Info): анализирует запрошенные клиентом поля в дереве GraphQL-запроса и загружает только нужные связи заранее через Prisma include',
    },
  },
});
