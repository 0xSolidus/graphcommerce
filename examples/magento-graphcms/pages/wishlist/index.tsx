import { PageOptions } from '@graphcommerce/framer-next-pages'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  WishlistItems,
  useWishlistItems,
  WishlistItem,
  WishlistItemBase,
} from '@graphcommerce/magento-wishlist'
import {
  GetStaticProps,
  iconHeart,
  FullPageMessage,
  Button,
  LayoutTitle,
  IconSvg,
  LayoutOverlayHeader,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Container, NoSsr } from '@mui/material'
import Link from 'next/link'

import { LayoutOverlay, LayoutOverlayProps } from '../../components'
import { graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutOverlayProps, Props>

function WishlistPage(props: Props) {
  const wishlistItemsData = useWishlistItems()

  return (
    <>
      <PageMeta title={i18n._(/* i18n */ 'Wishlist')} metaRobots={['noindex']} />
      <LayoutOverlayHeader>
        <LayoutTitle component='span' size='small'>
          <Trans id='Wishlist' />
        </LayoutTitle>
      </LayoutOverlayHeader>

      {wishlistItemsData.loading ? (
        <Container maxWidth='md'>
          <FullPageMessage
            title={<Trans id='Loading wishlist' />}
            icon={<IconSvg src={iconHeart} size='xxl' />}
          >
            <Trans id='We are fetching your favorite products, one moment please!' />
          </FullPageMessage>
        </Container>
      ) : (
        <Container maxWidth='md'>
          {!wishlistItemsData.items || wishlistItemsData.items?.length === 0 ? (
            <FullPageMessage
              title={<Trans id='Your wishlist is empty' />}
              icon={<IconSvg src={iconHeart} size='xxl' />}
              button={
                <Link href='/' passHref>
                  <Button variant='pill' color='primary' size='large'>
                    <Trans id='Continue shopping' />
                  </Button>
                </Link>
              }
            >
              <Trans id='Discover our collection and add items to your wishlist!' />
            </FullPageMessage>
          ) : (
            <>
              <LayoutTitle icon={iconHeart}>
                <Trans id='Wishlist' />
              </LayoutTitle>
              <Container maxWidth='md'>
                <WishlistItems
                  renderer={{
                    BundleProduct: WishlistItemBase,
                    ConfigurableProduct: WishlistItemBase,
                    DownloadableProduct: WishlistItemBase,
                    SimpleProduct: WishlistItem,
                    VirtualProduct: WishlistItem,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore GiftCardProduct is only available in Commerce
                    GiftCardProduct: WishlistItemBase,
                  }}
                />
              </Container>
            </>
          )}
        </Container>
      )}
    </>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  overlayGroup: 'bottom',
  Layout: LayoutOverlay,
  layoutProps: { variantMd: 'bottom', variantSm: 'bottom' },
}
WishlistPage.pageOptions = pageOptions

export default WishlistPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  return {
    props: {
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
