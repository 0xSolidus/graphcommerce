import { MoneyProps } from '@reachdigital/magento-store'
import { TypeRenderer } from '@reachdigital/next-ui/RenderType'
import { ProductListItemConfigurableFragment } from '../ProductListItemConfigurable.gql'
import { SwatchDataFragment } from './SwatchData.gql'

type ConfigurableOption = NonNullable<
  NonNullable<ProductListItemConfigurableFragment['configurable_options']>[0]
>
export type ConfigurableOptionValue = NonNullable<NonNullable<ConfigurableOption['values']>[0]>

export type SwatchSize = 'small' | 'large'

export type SwatchDataProps = ConfigurableOptionValue & {
  size?: SwatchSize
  price?: MoneyProps
}

export type SwatchTypeRenderer = TypeRenderer<SwatchDataFragment, SwatchDataProps>
