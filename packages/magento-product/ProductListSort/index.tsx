import { useQuery } from '@apollo/client'
import { cloneDeep } from '@apollo/client/utilities'
import { ListItem, ListItemText } from '@material-ui/core'
import {
  CategoryLink,
  useCategoryPushRoute,
  useProductListParamsContext,
} from '@reachdigital/magento-category'

import { StoreConfigDocument } from '@reachdigital/magento-store'
import ChipMenu, { ChipMenuProps } from '@reachdigital/next-ui/ChipMenu'
import React from 'react'
import { ProductListSortFragment } from './ProductListSort.gql'

export type ProductListSortProps = ProductListSortFragment &
  Omit<ChipMenuProps, 'selected' | 'selectedLabel' | 'children' | 'label' | 'onDelete'>

export default function ProductListSort({ sort_fields, ...filterMenuProps }: ProductListSortProps) {
  const { params } = useProductListParamsContext()
  const pushRoute = useCategoryPushRoute()
  const { data: storeConfigQuery } = useQuery(StoreConfigDocument)
  const defaultSort = storeConfigQuery?.storeConfig?.catalog_default_sort_by

  const [currentSort = defaultSort] = Object.keys(params.sort)
  const currentOption = sort_fields?.options?.find((option) => option?.value === currentSort)
  const selected = currentSort !== defaultSort
  const label = 'Sort By'

  const removeFilter = () => {
    const linkParams = cloneDeep(params)
    linkParams.sort = {}
    pushRoute(linkParams)
  }

  return (
    <ChipMenu
      variant='outlined'
      selected={selected}
      label={label}
      {...filterMenuProps}
      selectedLabel={selected ? currentOption?.label ?? '' : label}
      onDelete={selected ? removeFilter : undefined}
    >
      {sort_fields?.options?.map((option) => {
        const linkParams = cloneDeep(params)
        linkParams.sort = {}
        if (option?.value !== defaultSort) linkParams.sort[option?.value ?? ''] = 'ASC'
        delete linkParams.currentPage

        return (
          <ListItem
            button
            key={option?.value ?? ''}
            dense
            selected={option?.value === currentSort}
            component={(chipProps) => (
              <CategoryLink
                {...chipProps}
                {...linkParams}
                color='inherit'
                underline='none'
                link={{ scroll: false }}
              />
            )}
          >
            <ListItemText secondary>{option?.label}</ListItemText>
          </ListItem>
        )
      })}
    </ChipMenu>
  )
}
