// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export const CartItemSimpleFragmentDoc: DocumentNode<CartItemSimpleFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CartItemSimple' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SimpleCartItem' } },
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
export type CartItemSimpleFragment = Pick<Types.SimpleCartItem, 'id'>
