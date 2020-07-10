import React from 'react'
import ProductListItem from 'components/ProductListItems/ProductListItem'
import MagentoDynamic from 'components/MagentoDynamic/MagentoDynamic'
import { Button } from '@material-ui/core'

type ProductListItemSimpleProps = GQLProductListItemSimpleFragment

export default function ProductListItemSimple(props: ProductListItemSimpleProps) {
  const { sku } = props
  return (
    <ProductListItem {...props}>
      <MagentoDynamic
        loader={() => import('./AddSimpleProductToCart')}
        skeleton={(ref) => (
          <Button color='primary' variant='contained' ref={ref}>
            Add to Cart
          </Button>
        )}
        sku={sku}
      />
    </ProductListItem>
  )
}
