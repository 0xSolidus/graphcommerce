// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export const CmsPageContentFragmentDoc: DocumentNode<CmsPageContentFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CmsPageContent' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CmsPage' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'content_heading' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'content' },
            arguments: [],
            directives: [],
          },
        ],
      },
    },
  ],
}
export type CmsPageContentFragment = Pick<Types.CmsPage, 'content_heading' | 'content'>
