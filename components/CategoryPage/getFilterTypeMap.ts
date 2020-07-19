import apolloClient from 'node/apolloClient'
import { gql } from '@apollo/client'
import { AllFilterInputTypes, FilterTypeMap } from '../ProductListItems/filterTypes'

const allFilterInputTypes: AllFilterInputTypes[] = [
  'FilterEqualTypeInput',
  'FilterMatchTypeInput',
  'FilterRangeTypeInput',
]

type FilterInputTypesQueryVariables = Exact<{ [key: string]: never }>

type FilterInputTypesQuery = {
  __type: {
    inputFields: {
      name: string
      type: { name: AllFilterInputTypes }
    }[]
  }
}

const FilterInputTypesDocument = gql`
  query FilterInputTypes {
    __type(name: "ProductAttributeFilterInput") {
      inputFields {
        name
        type {
          name
        }
      }
    }
  }
`

export default async function getFilterTypeMap(): Promise<FilterTypeMap> {
  const client = await apolloClient()
  const filterInputTypes = client.query<FilterInputTypesQuery, FilterInputTypesQueryVariables>({
    query: FilterInputTypesDocument,
  })

  const typeMap: { [index: string]: typeof allFilterInputTypes[0] } = {}

  ;(await filterInputTypes).data?.__type.inputFields.forEach(({ name, type }) => {
    if (!allFilterInputTypes.includes(type.name))
      throw new Error(`filter ${name} with FilterTypeInput ${type.name} not implemented`)

    typeMap[name] = type.name
  })

  return typeMap
}
