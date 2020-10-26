// Do not edit this file: autogenerated by graphql-code-generator
import {
  ProductListItem_VirtualProduct_Fragment,
  ProductListItem_SimpleProduct_Fragment,
  ProductListItem_DownloadableProduct_Fragment,
  ProductListItem_BundleProduct_Fragment,
  ProductListItem_GroupedProduct_Fragment,
  ProductListItem_ConfigurableProduct_Fragment,
} from '../magento-product/ProductListItem.graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { ProductListItemFragmentDoc } from '../magento-product/ProductListItem.graphql'
export const ProductListItemDownloadableFragmentDoc: DocumentNode<
  ProductListItemDownloadableFragment,
  unknown
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductListItemDownloadable' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DownloadableProduct' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'ProductListItem' },
            directives: [],
          },
        ],
      },
    },
    ...ProductListItemFragmentDoc.definitions,
  ],
}
export type ProductListItemDownloadableFragment = ProductListItem_DownloadableProduct_Fragment
