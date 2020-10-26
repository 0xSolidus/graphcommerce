// Do not edit this file: autogenerated by graphql-code-generator
import * as Types from '@reachdigital/magento-graphql'

import { CustomerAddressFragment } from './CustomerAddress.graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { CustomerAddressFragmentDoc } from './CustomerAddress.graphql'
export const CustomerInfoFragmentDoc: DocumentNode<CustomerInfoFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Customer' } },
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'default_billing' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'default_shipping' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addresses' },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CustomerAddress' },
                  directives: [],
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'email' }, arguments: [], directives: [] },
          { kind: 'Field', name: { kind: 'Name', value: 'prefix' }, arguments: [], directives: [] },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'firstname' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'middlename' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastname' },
            arguments: [],
            directives: [],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'suffix' }, arguments: [], directives: [] },
          { kind: 'Field', name: { kind: 'Name', value: 'gender' }, arguments: [], directives: [] },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'is_subscribed' },
            arguments: [],
            directives: [],
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'date_of_birth' },
            arguments: [],
            directives: [],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'taxvat' }, arguments: [], directives: [] },
        ],
      },
    },
    ...CustomerAddressFragmentDoc.definitions,
  ],
}
export type CustomerInfoFragment = Pick<
  Types.Customer,
  | 'default_billing'
  | 'default_shipping'
  | 'email'
  | 'prefix'
  | 'firstname'
  | 'middlename'
  | 'lastname'
  | 'suffix'
  | 'gender'
  | 'is_subscribed'
  | 'date_of_birth'
  | 'taxvat'
> & { addresses?: Types.Maybe<Array<Types.Maybe<CustomerAddressFragment>>> }
