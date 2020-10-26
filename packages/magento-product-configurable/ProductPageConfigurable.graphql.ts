// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

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
export const ProductPageConfigurableFragmentDoc: DocumentNode<
  ProductPageConfigurableFragment,
  unknown
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductPageConfigurable' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ConfigurableProduct' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'configurable_options' },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attribute_code' },
                  arguments: [],
                  directives: [],
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'id' },
                  arguments: [],
                  directives: [],
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'label' },
                  arguments: [],
                  directives: [],
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'values' },
                  arguments: [],
                  directives: [],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'store_label' },
                        arguments: [],
                        directives: [],
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'value_index' },
                        arguments: [],
                        directives: [],
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'swatch_data' },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: '__typename' },
                              arguments: [],
                              directives: [],
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'value' },
                              arguments: [],
                              directives: [],
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'ImageSwatchData' },
                              },
                              directives: [],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                    arguments: [],
                                    directives: [],
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variants' },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attributes' },
                  arguments: [],
                  directives: [],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'code' },
                        arguments: [],
                        directives: [],
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'value_index' },
                        arguments: [],
                        directives: [],
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'label' },
                        arguments: [],
                        directives: [],
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  arguments: [],
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
              ],
            },
          },
        ],
      },
    },
    ...ProductListItemFragmentDoc.definitions,
  ],
}
export type ProductPageConfigurableFragment = {
  configurable_options?: Types.Maybe<
    Array<
      Types.Maybe<
        Pick<Types.ConfigurableProductOptions, 'attribute_code' | 'id' | 'label'> & {
          values?: Types.Maybe<
            Array<
              Types.Maybe<
                Pick<Types.ConfigurableProductOptionsValues, 'store_label' | 'value_index'> & {
                  swatch_data?: Types.Maybe<
                    | ({ __typename: 'ImageSwatchData' } & Pick<
                        Types.ImageSwatchData,
                        'thumbnail' | 'value'
                      >)
                    | ({ __typename: 'TextSwatchData' } & Pick<Types.TextSwatchData, 'value'>)
                    | ({ __typename: 'ColorSwatchData' } & Pick<Types.ColorSwatchData, 'value'>)
                  >
                }
              >
            >
          >
        }
      >
    >
  >
  variants?: Types.Maybe<
    Array<
      Types.Maybe<{
        attributes?: Types.Maybe<
          Array<
            Types.Maybe<Pick<Types.ConfigurableAttributeOption, 'code' | 'value_index' | 'label'>>
          >
        >
        product?: Types.Maybe<ProductListItem_SimpleProduct_Fragment>
      }>
    >
  >
}
