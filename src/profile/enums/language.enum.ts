import { registerEnumType } from '@nestjs/graphql';

export enum Language {
  EN = 'EN',
  RU = 'RU',
}

registerEnumType(Language, {
  name: 'Language',
  description: 'Response language (EN by default, RU for Russian)',
  valuesMap: {
    EN: { description: 'English language (default)' },
    RU: { description: 'Russian language' },
  },
});

export enum OptimizationStrategy {
  DATALOADER = 'DATALOADER',
  AST_JOIN = 'AST_JOIN',
}

registerEnumType(OptimizationStrategy, {
  name: 'OptimizationStrategy',
  description:
    'Database query optimization strategy for nested GraphQL fields: DATALOADER or AST_JOIN',
  valuesMap: {
    DATALOADER: {
      description: 'Batches nested resolver queries via DataLoader (WHERE profile_id IN)',
    },
    AST_JOIN: {
      description: 'Inspects GraphQL AST (@Info) and preloads requested relations via Prisma include',
    },
  },
});
