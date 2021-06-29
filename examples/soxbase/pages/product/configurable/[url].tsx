import { Link, makeStyles, Theme, Typography } from '@material-ui/core'
import { PageOptions } from '@reachdigital/framer-next-pages'
import {
  ProductPageGallery,
  ProductPageMeta,
  jsonLdProduct,
  jsonLdProductOffer,
  productPageCategory,
  getProductStaticPaths,
  ProductSidebarDelivery,
} from '@reachdigital/magento-product'
import {
  ConfigurableContextProvider,
  ConfigurableProductAddToCart,
  ConfigurableProductPageDocument,
  ConfigurableProductPageQuery,
} from '@reachdigital/magento-product-configurable'
import { jsonLdProductReview, ProductReviewSummary } from '@reachdigital/magento-product-review'
import { Money, StoreConfigDocument } from '@reachdigital/magento-store'
import JsonLd from '@reachdigital/next-ui/JsonLd'
import { GetStaticProps } from '@reachdigital/next-ui/Page/types'
import responsiveVal from '@reachdigital/next-ui/Styles/responsiveVal'
import { GetStaticPaths } from 'next'
import PageLink from 'next/link'
import React from 'react'
import { Product } from 'schema-dts'
import FullPageShell, { FullPageShellProps } from '../../../components/AppShell/FullPageShell'
import { ProductPageDocument, ProductPageQuery } from '../../../components/GraphQL/ProductPage.gql'
import ProductUsps from '../../../components/ProductUsps'
import ProductpagesContent from '../../../components/ProductpagesContent'
import RowProductDescription from '../../../components/RowProductDescription'
import RowProductFeature from '../../../components/RowProductFeature'
import RowProductFeatureBoxed from '../../../components/RowProductFeatureBoxed'
import RowProductRelated from '../../../components/RowProductRelated'
import RowProductReviews from '../../../components/RowProductReviews'
import RowProductSpecs from '../../../components/RowProductSpecs'
import RowProductUpsells from '../../../components/RowProductUpsells'
import apolloClient from '../../../lib/apolloClient'

type Props = ProductPageQuery & ConfigurableProductPageQuery

const useStyles = makeStyles(
  (theme: Theme) => ({
    productName: {
      fontSize: responsiveVal(28, 38),
      marginBottom: 5,
    },
    prePrice: {
      color: theme.palette.primary.mutedText,
      fontSize: responsiveVal(12, 18),
    },
  }),
  { name: 'ConfigurableProduct' },
)

type RouteProps = { url: string }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<FullPageShellProps, Props, RouteProps>

function ProductConfigurable(props: Props) {
  const { products, usps, typeProducts, sidebarUsps, productpages } = props
  const classes = useStyles()

  const product = products?.items?.[0]
  const typeProduct = typeProducts?.items?.[0]
  const aggregations = typeProducts?.aggregations

  if (
    product?.__typename !== 'ConfigurableProduct' ||
    typeProduct?.__typename !== 'ConfigurableProduct' ||
    !product.sku
  )
    return <></>

  return (
    <>
      <JsonLd<Product>
        item={{
          '@context': 'https://schema.org',
          ...jsonLdProduct(product),
          ...jsonLdProductOffer(product),
          ...jsonLdProductReview(product),
        }}
      />

      <ConfigurableContextProvider {...typeProduct} sku={product.sku}>
        <ProductPageMeta {...product} />
        <ProductPageGallery {...product}>
          <Typography paragraph>
            <Typography component='span' className={classes.prePrice} variant='body1'>
              As low as &nbsp;
            </Typography>
            <Typography component='span' variant='h5'>
              <Money {...product.price_range.minimum_price.regular_price} />
            </Typography>
          </Typography>
          <Typography component='h1' variant='h2' className={classes.productName}>
            {product.name}
          </Typography>
          <ProductReviewSummary {...product} reviewSectionId='reviews' />
          <ConfigurableProductAddToCart
            variables={{ sku: product.sku ?? '', quantity: 1 }}
            name={product.name ?? ''}
            optionEndLabels={{
              size: (
                <PageLink href='/modal/product/global/size' passHref>
                  <Link color='primary'>Which size is right?</Link>
                </PageLink>
              ),
            }}
          >
            <ProductSidebarDelivery />
          </ConfigurableProductAddToCart>
          <ProductUsps usps={sidebarUsps} size='small' />
        </ProductPageGallery>

        <RowProductDescription {...product} right={<ProductUsps usps={usps} iconSize={38} />} />
        <ProductpagesContent
          renderer={{
            RowProductFeature: (rowProps) => <RowProductFeature {...rowProps} {...product} />,
            RowProductFeatureBoxed: (rowProps) => (
              <RowProductFeatureBoxed {...rowProps} {...product} />
            ),
            RowProductSpecs: (rowProps) => (
              <RowProductSpecs {...rowProps} {...product} aggregations={aggregations} />
            ),
            RowProductReviews: (rowProps) => <RowProductReviews {...rowProps} {...product} />,
            RowProductRelated: (rowProps) => <RowProductRelated {...rowProps} {...product} />,
            RowProductUpsells: (rowProps) => <RowProductUpsells {...rowProps} {...product} />,
          }}
          content={productpages?.[0].content}
        />
      </ConfigurableContextProvider>
    </>
  )
}

ProductConfigurable.pageOptions = {
  SharedComponent: FullPageShell,
  sharedKey: () => 'page',
} as PageOptions

export default ProductConfigurable

export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  const path = (locale: string) =>
    getProductStaticPaths(apolloClient(locale), locale, 'ConfigurableProduct')
  const paths = (await Promise.all(locales.map(path))).flat(1)

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async ({ params, locale }) => {
  const client = apolloClient(locale, true)
  const staticClient = apolloClient(locale)

  const urlKey = params?.url ?? '??'
  const productUrls = [`product/${urlKey}`, 'product/global']

  const conf = client.query({ query: StoreConfigDocument })
  const productPage = staticClient.query({
    query: ProductPageDocument,
    variables: {
      urlKey,
      productUrls,
      rootCategory: (await conf).data.storeConfig?.root_category_uid ?? '',
    },
  })
  const typeProductPage = staticClient.query({
    query: ConfigurableProductPageDocument,
    variables: { urlKey },
  })

  if (
    (await productPage).data.products?.items?.[0]?.__typename !== 'ConfigurableProduct' ||
    (await typeProductPage).data.typeProducts?.items?.[0]?.__typename !== 'ConfigurableProduct'
  ) {
    return { notFound: true }
  }

  const category = productPageCategory((await productPage).data?.products?.items?.[0])
  return {
    props: {
      ...(await productPage).data,
      ...(await typeProductPage).data,
      apolloState: await conf.then(() => client.cache.extract()),
      backFallbackHref: category?.url_path ? `/${category?.url_path}` : null,
      backFallbackTitle: category?.name ?? null,
    },
    revalidate: 60 * 20,
  }
}
