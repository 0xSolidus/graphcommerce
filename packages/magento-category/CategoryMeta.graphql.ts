// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export const CategoryMetaFragmentDoc: DocumentNode<CategoryMetaFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CategoryMeta' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CategoryTree' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'name' }, arguments: [], directives: [] },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'meta_title' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'meta_description' },
            arguments: [],
            directives: [],
          },
        ],
      },
    },
  ],
}
export type CategoryMetaFragment = Pick<
  Types.CategoryTree,
  'name' | 'meta_title' | 'meta_description'
>
