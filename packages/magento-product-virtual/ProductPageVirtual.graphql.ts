// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export const ProductPageVirtualFragmentDoc: DocumentNode<ProductPageVirtualFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductPageVirtual' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VirtualProduct' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' }, arguments: [], directives: [] },
        ],
      },
    },
  ],
}
export type ProductPageVirtualFragment = Pick<Types.VirtualProduct, 'id'>
