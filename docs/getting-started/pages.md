---
menu: 4. Build pages
metaTitle: Build pages
---

# Build custom pages in GraphCommerce

Previously, you created a custom storefront and started customizing your
storefront in GraphCommerce. You're now ready to build pages in your
GraphCommerce app.

In this tutorial, you'll accomplish a series of tasks to add some specific
functionality to your custom storefront. The result will be simple, but you'll
learn where to find resources to build more complex features on your own.

> When you only want to create a new content page for a specific URL based on
> Hygraph rows, you don't need to create a custom template: After creating a
> page in Hygraph it will automatically be handled by the `/pages/[...url].tsx`
> route.

## What you'll learn

- Create a new route
- Add the page GraphQL queries required to render the layout (header, footer)
- Use getStaticProps to fetch Hygraph data
- Use getStaticPaths to provide a list of all URLs to pre-render

### Requirements

You've familiarized yourself with
[React ↗](https://reactjs.org/docs/getting-started.html),
[Next.js ↗](https://nextjs.org/docs/getting-started), and
[Mui ↗](https://mui.com/getting-started/installation/). GraphCommerce is a
frontend React framework that uses Next.js for server-side rendering.

---

### Create the route

- Create a new file, /pages/about/about-us.tsx:

```tsx
export default function AboutUs() {
  return <>About Us</>
}
```

- Visit the page: http://localhost:3000/about/about-us

### Add GraphQL query

- In /about/about-us.tsx, replace the previous code with the following:

```tsx
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  GetStaticProps,
  LayoutOverlayHeader,
  LayoutTitle,
  PageMeta,
} from '@graphcommerce/next-ui'
import {
  LayoutDocument,
  LayoutNavigation,
  LayoutNavigationProps,
} from '../../components'
import {
  graphqlSsrClient,
  graphqlSharedClient,
} from '../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function AboutUs() {
  return (
    <>
      <LayoutOverlayHeader>
        <LayoutTitle size='small' component='span'>
          About us
        </LayoutTitle>
      </LayoutOverlayHeader>
      <PageMeta title='About us' />
      <LayoutTitle>About us</LayoutTitle>
    </>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}
AboutUs.pageOptions = pageOptions

export default AboutUs

export const getStaticProps: GetPageStaticProps = async (context) => {
  const client = graphqlSharedClient(context)
  const staticClient = graphqlSsrClient(context)

  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({
    query: LayoutDocument,
    fetchPolicy: 'cache-first',
  })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
```

- Visiting http://localhost:3000/about/about-us will output:

<figure>

![Page with page layout (header, footer)](https://github.com/graphcommerce-org/graphcommerce/assets/1244416/9a7476d2-4763-4d8e-86a9-046fd27cb846)

  <figcaption>Page with page layout (header, footer)</figcaption>
</figure>

```graphql
# Example from /components/Layout/Layout.graphql (LayoutDocument)
query Layout {
  menu: categories {
    __typename
  }
  ...MenuQueryFragment
  ...FooterQueryFragment
}
```

In the `getStaticProps` function, the query `StoreConfigDocument` is used to
fetch information about the Magento storeview. Then, the query `LayoutDocument`
is used to fetch the data required to render the menu, footer and page content.

The function `getStaticProps` is used to fetch data, meaning content is rendered
on the server. Review the page's source code and search for `About Us` to
validate that this string (currently hard-coded) is part of the source code.

### Add Hygraph content to the page

- Login to Hygraph, navigate to Content and add a new Page entry with URL:
  about/about-us
- Replace the content of the about-us.tsx file with:

```tsx
import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  hygraphPageContent,
  HygraphPagesQuery,
} from '@graphcommerce/hygraph-ui'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  GetStaticProps,
  LayoutOverlayHeader,
  LayoutTitle,
  PageMeta,
} from '@graphcommerce/next-ui'
import { GetStaticPaths } from 'next'
import {
  LayoutDocument,
  LayoutNavigation,
  LayoutNavigationProps,
  RowRenderer,
} from '../../components'
import {
  graphqlSsrClient,
  graphqlSharedClient,
} from '../../lib/graphql/graphqlSsrClient'

type Props = HygraphPagesQuery
type RouteProps = { url: string }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<
  LayoutNavigationProps,
  Props,
  RouteProps
>

function AboutUs(props: Props) {
  const { pages } = props
  const page = pages[0]

  return (
    <>
      <LayoutOverlayHeader>
        <LayoutTitle size='small' component='span'>
          {page.title}
        </LayoutTitle>
      </LayoutOverlayHeader>
      <PageMeta
        title={page.metaTitle ?? ''}
        metaDescription={page.metaDescription}
      />
      <LayoutTitle>{page.title}</LayoutTitle>

      <RowRenderer content={page.content} />
    </>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}
AboutUs.pageOptions = pageOptions

export default AboutUs

export const getStaticProps: GetPageStaticProps = async (context) => {
  const client = graphqlSharedClient(context)
  const staticClient = graphqlSsrClient(context)

  const conf = client.query({ query: StoreConfigDocument })
  const page = hygraphPageContent(staticClient, 'about/about-us')
  const layout = staticClient.query({
    query: LayoutDocument,
    fetchPolicy: 'cache-first',
  })

  if (!(await page).data.pages?.[0]) return { notFound: true }

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
```

<figure>

![Fetch page content from Hygraph](https://user-images.githubusercontent.com/1251986/157832923-a2b47e92-ae7c-4557-bc54-a0b04e0d6d7e.png)

  <figcaption>Fetch page content from Hygraph</figcaption>
</figure>

<figure>

![Hygraph entry](https://user-images.githubusercontent.com/1251986/157832975-dc56d48c-a1ef-41d9-9f7c-67d2f19250e4.png)

  <figcaption>Hygraph entry</figcaption>
</figure>

### Add pre-rendering with getStaticPaths

- Rename `/about/about-us.tsx` to `/about/[url].tsx`
- In /about/[url].tsx, replace the getStaticProps function with the following:

```tsx
export const getStaticPaths: GetPageStaticPaths = (context) => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetPageStaticProps = async (context) => {
  const { params } = context
  const client = graphqlSharedClient(context)
  const staticClient = graphqlSsrClient(context)

  const conf = client.query({ query: StoreConfigDocument })
  const page = hygraphPageContent(staticClient, `about/${params?.url}`)
  const layout = staticClient.query({
    query: LayoutDocument,
    fetchPolicy: 'cache-first',
  })

  if (!(await page).data.pages?.[0]) return { notFound: true }

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
```

By renaming the file to `/about/[url].tsx`, all routes starting with /about/
will be handled by the file (dynamic routing). Pages that have dynamic routes
need a list of paths to be statically generated.

All paths specified by a function called `getStaticPaths` will be statically
pre-rendered at build-time.

In the example above, the array with paths is empty. The required getStaticPaths
function is there, but no URLs are pre-rendered. Because getStaticPaths has the
option `fallback: 'blocking'`, the paths that have not been pre-rendered at
built-time will not result in a 404:

> From the
> [getStaticPaths API reference ↗](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths):
> If fallback is 'blocking', new paths not returned by getStaticPaths will wait
> for the HTML to be generated, identical to SSR (hence why blocking), and then
> be cached for future requests so it only happens once per path.

### Pre-render all /about/ pages from Hygraph

- In /about/[url].tsx, replace the getStaticPaths function with the following:

```tsx
export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
  if (process.env.NODE_ENV === 'development')
    return { paths: [], fallback: 'blocking' }

  const path = async (locale: string) => {
    const client = graphqlSsrClient(locale)
    const { data } = await client.query({
      query: PagesStaticPathsDocument,
      variables: {
        first: import.meta.graphCommerce.limitSsg ? 1 : 1000,
        urlStartsWith: 'about',
      },
    })
    return data.pages.map((page) => ({
      params: { url: page.url.split('/').slice(1) },
      locale,
    }))
  }
  const paths = (await Promise.all(locales.map(path))).flat(1)

  return { paths, fallback: 'blocking' }
}
```

The PagesStaticPathsDocument query is used to fetch all pages from Hygraph that
have a URL starting with 'about'. The locale options from the context object are
used to create an array:

```txt
// Terminal output for console.log(paths), upon refreshing the page

[
  { params: { url: 'about-us' }, locale: 'en-us' },
  { params: { url: 'about-us' }, locale: 'nl' },
  { params: { url: 'about-us' }, locale: 'fr-be' },
  { params: { url: 'about-us' }, locale: 'nl-be' },
  { params: { url: 'about-us' }, locale: 'en-gb' },
  { params: { url: 'about-us' }, locale: 'en-ca' },
]
```

## Build your local environment

You can test the static build process by running it locally:

- `cd /examples/magento-graphcms/` Navigate to the project directory
- `yarn build` Start static build process

<figure>

![Successful pre-render of the about/about-us page](https://user-images.githubusercontent.com/1251986/157833023-e15b2d1c-1d04-49d2-89c9-75fb0edfce85.jpg)

  <figcaption>Successful pre-render of the about/about-us page</figcaption>
</figure>

## Next steps

- Learn how to
  [build a custom Hygraph component](../getting-started/graphcms-component.md)
