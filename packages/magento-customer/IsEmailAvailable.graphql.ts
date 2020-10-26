// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

export const IsEmailAvailableDocument: DocumentNode<
  IsEmailAvailableQuery,
  IsEmailAvailableQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IsEmailAvailable' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
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
            name: { kind: 'Name', value: 'isEmailAvailable' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
              },
            ],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'is_email_available' },
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
export type IsEmailAvailableQueryVariables = Types.Exact<{
  email: Types.Scalars['String']
}>

export type IsEmailAvailableQuery = {
  isEmailAvailable?: Types.Maybe<Pick<Types.IsEmailAvailableOutput, 'is_email_available'>>
}
