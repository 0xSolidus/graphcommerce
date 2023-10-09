import { useQuery } from '@graphcommerce/graphql'
import { useCustomerSession, useGuestQuery } from '@graphcommerce/magento-customer'
import { GetWishlistProductsDocument } from '../queries/GetWishlistProducts.gql'
import { GuestWishlistDocument, GuestWishlistQuery } from '../queries/GuestWishlist.gql'

export type WishListItem = NonNullable<
  NonNullable<
    NonNullable<NonNullable<GuestWishlistQuery['customer']>['wishlists'][0]>['items_v2']
  >['items']
>[0]

export type WishListData = WishListItem[] | undefined | null

export function useWishlistItems() {
  const { loggedIn } = useCustomerSession()
  let wishlistItems: WishListData = []
  /** Get customer wishlist from session */
  const customerWl = useQuery(GetWishlistProductsDocument, { ssr: false, skip: !loggedIn })

  /** Get guest wishlist items from cache and hydrate with catalog data */
  const guestWl = useGuestQuery(GuestWishlistDocument, { ssr: false, skip: loggedIn })
  const loading = guestWl.loading || customerWl.loading

  // When loading the queries, data will return undefined. While we load the new data, we want
  // to return the previous data, to prevent the UI for going in a loading state
  if (loading && loggedIn)
    wishlistItems = customerWl.previousData?.customer?.wishlists[0]?.items_v2?.items

  if (!loading && loggedIn) wishlistItems = customerWl.data?.customer?.wishlists[0]?.items_v2?.items

  if (!loggedIn) wishlistItems = guestWl.data?.customer?.wishlists[0]?.items_v2?.items

  return {
    ...(loggedIn ? customerWl : guestWl),
    data: wishlistItems,
  }
}
