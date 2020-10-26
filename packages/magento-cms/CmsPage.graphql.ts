// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

export const CmsPageDocument: DocumentNode<CmsPageQuery, CmsPageQueryVariables> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CmsPage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'identifier' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
          directives: [],
        },
      ],
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cmsPage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'identifier' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'identifier' } },
              },
            ],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'identifier' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'title' },
                  arguments: [],
                  directives: [],
                },
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
      },
    },
  ],
}
export type CmsPageQueryVariables = Types.Exact<{
  identifier: Types.Scalars['String']
}>

export type CmsPageQuery = {
  cmsPage?: Types.Maybe<
    Pick<
      Types.CmsPage,
      'identifier' | 'meta_title' | 'meta_description' | 'title' | 'content_heading' | 'content'
    >
  >
}
