import { FieldNode, GraphQLResolveInfo, SelectionSetNode } from 'graphql';

/**
 * Список поддерживаемых вложенных связей (relations) модели Profile.
 */
export interface RequestedProfileRelations {
  links: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  certifications: boolean;
}

/**
 * Метод оптимизации №2: Анализ AST-дерева запроса GraphQL (AST Lookahead).
 *
 * Как это работает:
 * Прежде чем выполнить запрос в базу данных, Apollo Server строит из текста GraphQL-запроса
 * Абстрактное Синтаксическое Дерево (AST — Abstract Syntax Tree) и передает его в `@Info()`.
 *
 * Эта функция рекурсивно обходит узлы `SelectionSet` (включая именованные и инлайн-фрагменты)
 * и определяет, какие именно дочерние таблицы реально запросил клиент.
 * Благодаря этому Prisma может подгрузить ТОЛЬКО запрошенные таблицы сразу через `include`,
 * не делая лишних запросов к таблицам, которые клиент не просил.
 */
export function extractRequestedRelations(
  info: GraphQLResolveInfo,
): RequestedProfileRelations {
  const requestedFields = new Set<string>();

  const collectFields = (selectionSet?: SelectionSetNode): void => {
    if (!selectionSet) {
      return;
    }

    for (const selection of selectionSet.selections) {
      if (selection.kind === 'Field') {
        requestedFields.add(selection.name.value);
      } else if (selection.kind === 'InlineFragment') {
        collectFields(selection.selectionSet);
      } else if (selection.kind === 'FragmentSpread') {
        const fragment = info.fragments[selection.name.value];
        if (fragment) {
          collectFields(fragment.selectionSet);
        }
      }
    }
  };

  for (const fieldNode of info.fieldNodes as readonly FieldNode[]) {
    collectFields(fieldNode.selectionSet);
  }

  return {
    links: requestedFields.has('links'),
    skills: requestedFields.has('skills'),
    experience: requestedFields.has('experience'),
    projects: requestedFields.has('projects'),
    certifications: requestedFields.has('certifications'),
  };
}
