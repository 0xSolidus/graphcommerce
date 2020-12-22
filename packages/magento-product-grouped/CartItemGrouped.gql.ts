// Do not edit this file: autogenerated by graphql-code-generator
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as Types from '@reachdigital/magento-graphql'

export const CartItemGroupedFragmentDoc: DocumentNode<CartItemGroupedFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CartItemGrouped' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CartItemInterface' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
      },
    },
  ],
}
export type CartItemGrouped_SimpleCartItem_Fragment = Pick<Types.SimpleCartItem, 'id'>

export type CartItemGrouped_VirtualCartItem_Fragment = Pick<Types.VirtualCartItem, 'id'>

export type CartItemGrouped_DownloadableCartItem_Fragment = Pick<Types.DownloadableCartItem, 'id'>

export type CartItemGrouped_BundleCartItem_Fragment = Pick<Types.BundleCartItem, 'id'>

export type CartItemGrouped_ConfigurableCartItem_Fragment = Pick<Types.ConfigurableCartItem, 'id'>

export type CartItemGroupedFragment =
  | CartItemGrouped_SimpleCartItem_Fragment
  | CartItemGrouped_VirtualCartItem_Fragment
  | CartItemGrouped_DownloadableCartItem_Fragment
  | CartItemGrouped_BundleCartItem_Fragment
  | CartItemGrouped_ConfigurableCartItem_Fragment
