import type { ProductPageDescriptionProps } from '@graphcommerce/magento-product'
import type { IfConfig, PluginProps } from '@graphcommerce/next-config'
import type { ConfigurableOptionsFragment } from '../graphql/ConfigurableOptions.gql'
import { useConfigurableOptionsSelection } from '../hooks'

export const component = 'ProductPageDescription'
export const exported = '@graphcommerce/magento-product'
export const ifConfig: IfConfig = 'configurableVariantValues.content'

function ConfigurableProductPageDescription(
  props: PluginProps<ProductPageDescriptionProps & Partial<ConfigurableOptionsFragment>>,
) {
  const { Prev, product, ...rest } = props
  const variant = useConfigurableOptionsSelection({ url_key: product.url_key, index: 0 }).configured
    ?.configurable_product_options_selection?.variant

  const updatedProduct = {
    name: variant?.name ? variant?.name : product.name,
    description: variant?.description?.html.length ? variant?.description : product.description,
  }

  return <Prev product={updatedProduct} {...rest} />
}

export const Plugin = ConfigurableProductPageDescription
