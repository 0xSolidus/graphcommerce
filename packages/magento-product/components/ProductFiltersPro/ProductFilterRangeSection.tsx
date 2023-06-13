import { Controller } from '@graphcommerce/ecommerce-ui'
import type { ProductAttributeFilterInput } from '@graphcommerce/graphql-mesh'
import { isFilterTypeRange } from '../ProductListItems/filterTypes'
import { PriceSlider, getMinMaxFromOptions } from './PriceSlider'
import { ProductFilterAccordion } from './ProductFilterAccordion'
import { useProductFiltersPro } from './ProductFiltersPro'
import { FilterProps } from './ProductFiltersProAggregations'

export function ProductFilterRangeSection(props: FilterProps) {
  const { aggregation } = props
  const { attribute_code, label, options } = aggregation

  const { form, params } = useProductFiltersPro()
  const { control } = form
  const attrCode = attribute_code as keyof ProductAttributeFilterInput
  const name = `filters.${attrCode}` as const

  const param = params.filters?.[attrCode]
  if (param && !isFilterTypeRange(param)) throw new Error('Invalid filter type')

  const [min, max] = getMinMaxFromOptions(options)

  if (!options) return null

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        if (value && !isFilterTypeRange(value)) throw new Error('Invalid filter type')

        const from = value?.from ? Number(value?.from) : min
        const to = value?.to ? Number(value?.to) : max

        return (
          <ProductFilterAccordion
            summary={label}
            details={<PriceSlider options={options} value={value} onChange={onChange} />}
            onClear={() => {
              form.resetField(name, { defaultValue: null })
            }}
            renderButton={from !== min || to !== max}
          />
        )
      }}
    />
  )
}
