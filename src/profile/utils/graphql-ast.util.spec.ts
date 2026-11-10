import { GraphQLResolveInfo, parse } from 'graphql';
import { extractRequestedRelations } from './graphql-ast.util';

describe('extractRequestedRelations', () => {
  it('detects only the nested relations present in the GraphQL selection set', () => {
    const document = parse(`
      query {
        profile {
          name
          description
          skills {
            name
          }
          projects {
            name
          }
        }
      }
    `);

    const operation = document.definitions[0] as any;
    const profileFieldNode = operation.selectionSet.selections[0];

    const fakeInfo = {
      fieldNodes: [profileFieldNode],
      fragments: {},
    } as unknown as GraphQLResolveInfo;

    const relations = extractRequestedRelations(fakeInfo);

    expect(relations).toEqual({
      links: false,
      skills: true,
      experience: false,
      projects: true,
      certifications: false,
    });
  });
});
