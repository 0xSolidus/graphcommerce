// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export const BillingCartAddressFragmentDoc: DocumentNode<BillingCartAddressFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BillingCartAddress' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BillingCartAddress' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'firstname' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastname' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'company' },
            arguments: [],
            directives: [],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'city' }, arguments: [], directives: [] },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'postcode' },
            arguments: [],
            directives: [],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'street' }, arguments: [], directives: [] },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
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
                  name: { kind: 'Name', value: 'label' },
                  arguments: [],
                  directives: [],
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'region' },
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
                  name: { kind: 'Name', value: 'label' },
                  arguments: [],
                  directives: [],
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'telephone' },
            arguments: [],
            directives: [],
          },
        ],
      },
    },
  ],
}
export type BillingCartAddressFragment = Pick<
  Types.BillingCartAddress,
  'firstname' | 'lastname' | 'company' | 'city' | 'postcode' | 'street' | 'telephone'
> & {
  country: Pick<Types.CartAddressCountry, 'code' | 'label'>
  region?: Types.Maybe<Pick<Types.CartAddressRegion, 'code' | 'label'>>
}
