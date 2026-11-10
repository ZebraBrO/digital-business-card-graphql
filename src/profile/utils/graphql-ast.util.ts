import { FieldNode, GraphQLResolveInfo, SelectionSetNode } from 'graphql';

export interface RequestedProfileRelations {
  links: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  certifications: boolean;
}

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
