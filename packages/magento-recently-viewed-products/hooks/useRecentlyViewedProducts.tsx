import { useQuery } from '@graphcommerce/graphql'
import { ProductListDocument } from '@graphcommerce/magento-product'
import { nonNullable } from '@graphcommerce/next-ui'
import { useRecentlyViewedSkus, useRecentlyViewedSkusProps } from './useRecentlyViewedSkus'

export type UseRecentlyViewedProductsProps = useRecentlyViewedSkusProps
export function useRecentlyViewedProducts({ exclude }: UseRecentlyViewedProductsProps = {}) {
  const { skus, loading } = useRecentlyViewedSkus({ exclude })

  const {
    loading: loadingProducts,
    data,
    previousData,
  } = useQuery(ProductListDocument, {
    variables: {
      filters: {
        sku: {
          in: skus.map((p) => p.sku),
        },
      },
    },
    skip: loading || !skus.length,
  })

  const productData = data?.products?.items || previousData?.products?.items || []
  // Sort products based on the time they were viewed. Last viewed item should be the first item in the array
  const products = skus
    .map((sku) => productData.find((p) => (p?.sku || '') === sku.sku))
    .filter(nonNullable)

  return {
    products,
    loading: loading || loadingProducts,
  }
}
