// Do not edit this file: autogenerated by graphql-code-generator
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as Types from '../../generated/types'

import { RowColumnOneFragment, RowColumnOneFragmentDoc } from '../RowColumnOne/RowColumnOne.gql'
import {
  RowColumnThreeFragment,
  RowColumnThreeFragmentDoc,
} from '../RowColumnThree/RowColumnThree.gql'
import { RowColumnTwoFragment, RowColumnTwoFragmentDoc } from '../RowColumnTwo/RowColumnTwo.gql'
import { RowHeroBannerFragment, RowHeroBannerFragmentDoc } from '../RowHeroBanner/RowHeroBanner.gql'
import {
  RowProductBackstoryFragment,
  RowProductBackstoryFragmentDoc,
} from '../RowProductBackstory/RowProductBackstory.gql'
import {
  RowProductGridFragment,
  RowProductGridFragmentDoc,
} from '../RowProductGrid/RowProductGrid.gql'
import { RowQuoteFragment, RowQuoteFragmentDoc } from '../RowQuote/RowQuote.gql'
import {
  RowSpecialBannerFragment,
  RowSpecialBannerFragmentDoc,
} from '../RowSpecialBanner/RowSpecialBanner.gql'

export const PageFragmentDoc: DocumentNode<PageFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Page' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Page' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'content' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Node' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowColumnOne' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowColumnTwo' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowColumnThree' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowHeroBanner' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowProductGrid' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowSpecialBanner' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowQuote' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'RowProductBackstory' } },
              ],
            },
          },
        ],
      },
    },
    ...RowColumnOneFragmentDoc.definitions,
    ...RowColumnTwoFragmentDoc.definitions,
    ...RowColumnThreeFragmentDoc.definitions,
    ...RowHeroBannerFragmentDoc.definitions,
    ...RowProductGridFragmentDoc.definitions,
    ...RowSpecialBannerFragmentDoc.definitions,
    ...RowQuoteFragmentDoc.definitions,
    ...RowProductBackstoryFragmentDoc.definitions,
  ],
}
export type PageFragment = {
  content: Array<
    | ({ __typename: 'RowButtonLinkList' } & Pick<Types.RowButtonLinkList, 'id'>)
    | ({ __typename: 'RowColumnOne' } & Pick<Types.RowColumnOne, 'id'> & RowColumnOneFragment)
    | ({ __typename: 'RowColumnThree' } & Pick<Types.RowColumnThree, 'id'> & RowColumnThreeFragment)
    | ({ __typename: 'RowColumnTwo' } & Pick<Types.RowColumnTwo, 'id'> & RowColumnTwoFragment)
    | ({ __typename: 'RowHeroBanner' } & Pick<Types.RowHeroBanner, 'id'> & RowHeroBannerFragment)
    | ({ __typename: 'RowProductBackstory' } & Pick<Types.RowProductBackstory, 'id'> &
        RowProductBackstoryFragment)
    | ({ __typename: 'RowProductGrid' } & Pick<Types.RowProductGrid, 'id'> & RowProductGridFragment)
    | ({ __typename: 'RowQuote' } & Pick<Types.RowQuote, 'id'> & RowQuoteFragment)
    | ({ __typename: 'RowSpecialBanner' } & Pick<Types.RowSpecialBanner, 'id'> &
        RowSpecialBannerFragment)
    | ({ __typename: 'RowSwipeableGrid' } & Pick<Types.RowSwipeableGrid, 'id'>)
  >
}
