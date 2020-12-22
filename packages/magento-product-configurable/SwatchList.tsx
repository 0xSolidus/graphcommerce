import { Maybe } from '@reachdigital/magento-graphql'
import RenderType from '@reachdigital/next-ui/RenderType'
import React from 'react'
import { ProductListItemConfigurableFragment } from './ProductListItemConfigurable.gql'
import { SwatchTypeRenderer } from './Swatches'
import ColorSwatchData from './Swatches/ColorSwatchData'
import ImageSwatchData from './Swatches/ImageSwatchData'
import TextSwatchData from './Swatches/TextSwatchData'

type SwatchListProps = {
  attributes: string[]
  configurable_options: Maybe<ProductListItemConfigurableFragment['configurable_options']>
}

const renderer: SwatchTypeRenderer = { TextSwatchData, ImageSwatchData, ColorSwatchData }

export default function SwatchList({ attributes, configurable_options }: SwatchListProps) {
  const locationOptions =
    configurable_options?.filter((option) => attributes.includes(option?.attribute_code ?? '')) ??
    []

  return (
    <>
      {locationOptions.map((option) => (
        <React.Fragment key={option?.attribute_code ?? ''}>
          {option?.values?.map((val) =>
            val?.swatch_data ? (
              <RenderType
                key={val?.value_index ?? ''}
                renderer={renderer}
                {...val}
                {...(val.swatch_data ?? {})}
              />
            ) : null,
          )}
        </React.Fragment>
      ))}
    </>
  )
}
