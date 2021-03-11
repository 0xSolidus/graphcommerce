import { ApolloClient, ApolloQueryResult, NormalizedCacheObject } from '@apollo/client'
import { GetStaticPathsResult } from 'next'
import { ProductStaticPathsDocument, ProductStaticPathsQuery } from './ProductStaticPaths.gql'

type Return = GetStaticPathsResult<{ url: string }>

type ProductTypenames = NonNullable<
  NonNullable<NonNullable<ProductStaticPathsQuery['products']>['items']>[0]
>['__typename']

export default async function getProductStaticPaths(
  client: ApolloClient<NormalizedCacheObject>,
  locale: string,
  typename: ProductTypenames,
) {
  const query = client.query({
    query: ProductStaticPathsDocument,
    variables: {
      currentPage: 1,
      pageSize: 100000,
    },
  })
  const pages: Promise<ApolloQueryResult<ProductStaticPathsQuery>>[] = [query]

  const paths: Return['paths'] = (await Promise.all(pages))
    .map((q) => q.data.products?.items)
    .flat(1)
    .filter((item) => item?.__typename === typename)
    .map((p) => ({ params: { url: `${p?.url_key}` }, locale }))

  return (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === 'development'
    ? paths.slice(0, 1)
    : paths
}
