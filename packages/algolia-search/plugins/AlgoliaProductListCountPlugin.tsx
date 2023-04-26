import { ProductCountProps } from '@graphcommerce/magento-product'
import { IfConfig, PluginProps } from '@graphcommerce/next-config'
import { usePagination } from 'react-instantsearch-hooks'
import { useSearchRoute } from '../hooks/useSearchRoute'

export const component = 'ProductListCount'
export const exported = '@graphcommerce/magento-product'
export const ifConfig: IfConfig = 'demoMode'

function ProductListCount(props: PluginProps<ProductCountProps>) {
  const { Prev, ...rest } = props
  const { nbHits } = usePagination()

  return <Prev {...rest} total_count={nbHits} />
}

function AlgoliaProductListCountPlugin(props: PluginProps<ProductCountProps>) {
  const { Prev, ...rest } = props
  const search = useSearchRoute()

  if (!search) return <Prev {...rest} />

  return <ProductListCount {...props} />
}

export const Plugin = AlgoliaProductListCountPlugin
