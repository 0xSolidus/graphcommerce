// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

export const GetProductStaticPathsDocument: DocumentNode<
  GetProductStaticPathsQuery,
  GetProductStaticPathsQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProductStaticPaths' },
      variableDefinitions: [],
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  arguments: [],
                  directives: [],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'children' },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'products' },
                              arguments: [],
                              directives: [],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'items' },
                                    arguments: [],
                                    directives: [],
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'url_key' },
                                          arguments: [],
                                          directives: [],
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'children' },
                              arguments: [],
                              directives: [],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'products' },
                                    arguments: [],
                                    directives: [],
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'items' },
                                          arguments: [],
                                          directives: [],
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url_key' },
                                                arguments: [],
                                                directives: [],
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'children' },
                                    arguments: [],
                                    directives: [],
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'products' },
                                          arguments: [],
                                          directives: [],
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'items' },
                                                arguments: [],
                                                directives: [],
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'url_key' },
                                                      arguments: [],
                                                      directives: [],
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'children' },
                                          arguments: [],
                                          directives: [],
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'products' },
                                                arguments: [],
                                                directives: [],
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'items' },
                                                      arguments: [],
                                                      directives: [],
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'url_key',
                                                            },
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
        ],
      },
    },
  ],
}
export type GetProductStaticPathsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetProductStaticPathsQuery = {
  categories?: Types.Maybe<{
    items?: Types.Maybe<
      Array<
        Types.Maybe<{
          children?: Types.Maybe<
            Array<
              Types.Maybe<{
                products?: Types.Maybe<{
                  items?: Types.Maybe<
                    Array<
                      Types.Maybe<
                        | Pick<Types.VirtualProduct, 'url_key'>
                        | Pick<Types.SimpleProduct, 'url_key'>
                        | Pick<Types.DownloadableProduct, 'url_key'>
                        | Pick<Types.BundleProduct, 'url_key'>
                        | Pick<Types.GroupedProduct, 'url_key'>
                        | Pick<Types.ConfigurableProduct, 'url_key'>
                      >
                    >
                  >
                }>
                children?: Types.Maybe<
                  Array<
                    Types.Maybe<{
                      products?: Types.Maybe<{
                        items?: Types.Maybe<
                          Array<
                            Types.Maybe<
                              | Pick<Types.VirtualProduct, 'url_key'>
                              | Pick<Types.SimpleProduct, 'url_key'>
                              | Pick<Types.DownloadableProduct, 'url_key'>
                              | Pick<Types.BundleProduct, 'url_key'>
                              | Pick<Types.GroupedProduct, 'url_key'>
                              | Pick<Types.ConfigurableProduct, 'url_key'>
                            >
                          >
                        >
                      }>
                      children?: Types.Maybe<
                        Array<
                          Types.Maybe<{
                            products?: Types.Maybe<{
                              items?: Types.Maybe<
                                Array<
                                  Types.Maybe<
                                    | Pick<Types.VirtualProduct, 'url_key'>
                                    | Pick<Types.SimpleProduct, 'url_key'>
                                    | Pick<Types.DownloadableProduct, 'url_key'>
                                    | Pick<Types.BundleProduct, 'url_key'>
                                    | Pick<Types.GroupedProduct, 'url_key'>
                                    | Pick<Types.ConfigurableProduct, 'url_key'>
                                  >
                                >
                              >
                            }>
                            children?: Types.Maybe<
                              Array<
                                Types.Maybe<{
                                  products?: Types.Maybe<{
                                    items?: Types.Maybe<
                                      Array<
                                        Types.Maybe<
                                          | Pick<Types.VirtualProduct, 'url_key'>
                                          | Pick<Types.SimpleProduct, 'url_key'>
                                          | Pick<Types.DownloadableProduct, 'url_key'>
                                          | Pick<Types.BundleProduct, 'url_key'>
                                          | Pick<Types.GroupedProduct, 'url_key'>
                                          | Pick<Types.ConfigurableProduct, 'url_key'>
                                        >
                                      >
                                    >
                                  }>
                                }>
                              >
                            >
                          }>
                        >
                      >
                    }>
                  >
                >
              }>
            >
          >
        }>
      >
    >
  }>
}
