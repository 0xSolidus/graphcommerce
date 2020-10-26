// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import {
  ProductLink_VirtualProduct_Fragment,
  ProductLink_SimpleProduct_Fragment,
  ProductLink_DownloadableProduct_Fragment,
  ProductLink_BundleProduct_Fragment,
  ProductLink_GroupedProduct_Fragment,
  ProductLink_ConfigurableProduct_Fragment,
} from './ProductLink.graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { ProductLinkFragmentDoc } from './ProductLink.graphql'
export const ProductPageMetaFragmentDoc: DocumentNode<ProductPageMetaFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductPageMeta' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductInterface' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductLink' }, directives: [] },
          { kind: 'Field', name: { kind: 'Name', value: 'name' }, arguments: [], directives: [] },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'url_key' },
            arguments: [],
            directives: [],
          },
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
    ...ProductLinkFragmentDoc.definitions,
  ],
}
export type ProductPageMeta_VirtualProduct_Fragment = Pick<
  Types.VirtualProduct,
  'name' | 'url_key' | 'meta_title' | 'meta_description'
> &
  ProductLink_VirtualProduct_Fragment

export type ProductPageMeta_SimpleProduct_Fragment = Pick<
  Types.SimpleProduct,
  'name' | 'url_key' | 'meta_title' | 'meta_description'
> &
  ProductLink_SimpleProduct_Fragment

export type ProductPageMeta_DownloadableProduct_Fragment = Pick<
  Types.DownloadableProduct,
  'name' | 'url_key' | 'meta_title' | 'meta_description'
> &
  ProductLink_DownloadableProduct_Fragment

export type ProductPageMeta_BundleProduct_Fragment = Pick<
  Types.BundleProduct,
  'name' | 'url_key' | 'meta_title' | 'meta_description'
> &
  ProductLink_BundleProduct_Fragment

export type ProductPageMeta_GroupedProduct_Fragment = Pick<
  Types.GroupedProduct,
  'name' | 'url_key' | 'meta_title' | 'meta_description'
> &
  ProductLink_GroupedProduct_Fragment

export type ProductPageMeta_ConfigurableProduct_Fragment = Pick<
  Types.ConfigurableProduct,
  'name' | 'url_key' | 'meta_title' | 'meta_description'
> &
  ProductLink_ConfigurableProduct_Fragment

export type ProductPageMetaFragment =
  | ProductPageMeta_VirtualProduct_Fragment
  | ProductPageMeta_SimpleProduct_Fragment
  | ProductPageMeta_DownloadableProduct_Fragment
  | ProductPageMeta_BundleProduct_Fragment
  | ProductPageMeta_GroupedProduct_Fragment
  | ProductPageMeta_ConfigurableProduct_Fragment
