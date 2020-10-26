// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export const CmsPageMetaFragmentDoc: DocumentNode<CmsPageMetaFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CmsPageMeta' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CmsPage' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
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
          { kind: 'Field', name: { kind: 'Name', value: 'title' }, arguments: [], directives: [] },
        ],
      },
    },
  ],
}
export type CmsPageMetaFragment = Pick<Types.CmsPage, 'meta_title' | 'meta_description' | 'title'>
