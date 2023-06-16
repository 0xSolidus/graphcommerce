import {
  useForm,
  useFormAutoSubmit,
  UseFormProps,
  UseFormReturn,
} from '@graphcommerce/ecommerce-ui'
import { extendableComponent, StickyBelowHeader, useMemoObject } from '@graphcommerce/next-ui'
import { useTheme, useMediaQuery, Container, Box } from '@mui/material'
import React, { BaseSyntheticEvent, createContext, useContext, useMemo } from 'react'
import { useProductListLinkReplace } from '../../hooks/useProductListLinkReplace'
import {
  ProductFilterParams,
  ProductListParams,
  toFilterParams,
  toProductListParams,
} from '../ProductListItems/filterTypes'

type FilterFormContextProps = {
  /**
   * Watch and formState are known to cause performance issues.
   *
   * - `watch` -> `useWatch`
   * - `formState` -> `useFormState`
   */
  form: Omit<UseFormReturn<ProductFilterParams>, 'formState' | 'watch'>
  params: ProductFilterParams
  submit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>
}

const FilterFormContext = createContext<FilterFormContextProps | null>(null)

export const useProductFiltersPro = () => {
  const context = useContext(FilterFormContext)
  if (!context) throw Error('useProductFiltersPro should be used inside ProductFiltersPro')
  return context
}

export type FilterFormProviderProps = Omit<
  UseFormProps<ProductFilterParams>,
  'values' | 'defaultValues'
> & {
  children: React.ReactNode
  params: ProductListParams

  chips: React.ReactNode
  sidebar?: React.ReactNode
  count?: React.ReactNode
}

const layout = import.meta.graphCommerce.productFiltersLayout

type OwnerProps = {
  layout?: NonNullable<typeof layout>
}
const name = 'ProductFiltersPro' as const
const parts = ['root', 'content'] as const
const { withState } = extendableComponent<OwnerProps, typeof name, typeof parts>(name, parts)

export function ProductFiltersPro(props: FilterFormProviderProps) {
  const { children, chips, count, params, sidebar, ...formProps } = props
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))

  const filterParams = useMemoObject(toFilterParams(params))
  const form = useForm<ProductFilterParams>({
    values: filterParams,
    ...formProps,
  })

  const { handleSubmit } = form

  const push = useProductListLinkReplace({ scroll: false })
  const submit = handleSubmit(async (formValues) =>
    push({ ...toProductListParams(formValues), currentPage: 1 }),
  )

  useFormAutoSubmit({ form, submit, disabled: matches && layout === 'SIDEBAR' })

  const classes = withState({ layout: layout ?? 'DEFAULT' })

  return (
    <FilterFormContext.Provider
      value={useMemo(() => ({ form, params: filterParams, submit }), [form, filterParams, submit])}
    >
      <form noValidate onSubmit={submit} />

      <StickyBelowHeader sx={{ display: { md: layout === 'SIDEBAR' ? 'none' : undefined } }}>
        {chips}
      </StickyBelowHeader>
      <Container
        maxWidth={false}
        className={classes.content}
        sx={{
          '&.layoutSIDEBAR': {
            display: 'grid',
            gridTemplate: {
              xs: `
                "count"      auto
                "items"      1fr
                "pagination" auto
              `,
              md: `
                "count   count"      auto
                "sidebar items"      1fr
                "sidebar pagination" auto
                /300px   auto
              `,
            },
            columnGap: { md: theme.spacings.md, xl: theme.spacings.xxl },

            '& .ProductListItemsBase-root': {
              gridArea: 'items',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              },
            },
          },
        }}
      >
        {sidebar && layout === 'SIDEBAR' && (
          <Box sx={{ gridArea: 'sidebar', display: { xs: 'none', md: 'block' } }}>{sidebar}</Box>
        )}
        <Box sx={{ gridArea: 'count', mt: { md: 0 } }}>{count}</Box>
        {children}
      </Container>
    </FilterFormContext.Provider>
  )
}
