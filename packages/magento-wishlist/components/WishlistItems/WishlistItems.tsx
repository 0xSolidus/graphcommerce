import { RenderType, TypeRenderer, nonNullable } from '@graphcommerce/next-ui'
import { Box } from '@mui/material'
import { useWishlistItems } from '../../hooks'
import { WishlistItemsFragment } from './WishlistItems.gql'
import { useCustomerSession } from '@graphcommerce/magento-customer'

export type WishlistItemRenderer = TypeRenderer<
  NonNullable<
    NonNullable<NonNullable<NonNullable<WishlistItemsFragment['items_v2']>['items']>[0]>['product']
  >
>

export type WishlistProps = { renderer: WishlistItemRenderer }

export function WishlistItems(props: WishlistProps) {
  const { renderer } = props
  const wishlistItemsData = useWishlistItems()
  const { loggedIn } = useCustomerSession()

  const wishlist = loggedIn
    ? wishlistItemsData.data
    : wishlistItemsData.guestWishlist.data?.guestWishlist?.items.map((guestItem) =>
        wishlistItemsData.data?.find((joe) => guestItem.sku === joe.sku),
      )

  /** Structure between guest and customer wishlist differs */
  return (
    <>
      {wishlist?.map((item, i) => {
        if (!item?.uid && !item?.id) return null

        const productData = item?.product ? item?.product : item
        const configurable_options =
          wishlistItemsData.guestWishlist.data && !loggedIn
            ? wishlistItemsData.guestWishlist.data?.guestWishlist?.items?.[i].selected_options
            : item.configurable_options?.map(
                (option) => option.configurable_product_option_value_uid,
              )

        const isConfigurableUncompleted =
          productData.__typename === 'ConfigurableProduct' &&
          productData.configurable_options.length !== configurable_options.length
        return (
          <Box key={loggedIn ? item.id || item.uid : i}>
            <RenderType
              renderer={renderer}
              wishlistItemId={loggedIn ? item.id || null : i}
              selectedOptions={configurable_options}
              isConfigurableUncompleted={isConfigurableUncompleted}
              {...productData}
            />
          </Box>
        )
      })}
    </>
  )
}
