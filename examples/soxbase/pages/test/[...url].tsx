import { Container } from '@material-ui/core'
import { PageOptions } from '@reachdigital/framer-next-pages'
import { StoreConfigDocument } from '@reachdigital/magento-store'
import { Button, DebugSpacer, GetStaticProps } from '@reachdigital/next-ui'
import { m } from 'framer-motion'
import { GetStaticPaths } from 'next'
import PageLink from 'next/link'
import React from 'react'
import FullPageShell, { FullPageShellProps } from '../../components/AppShell/FullPageShell'
import { DefaultPageDocument, DefaultPageQuery } from '../../components/GraphQL/DefaultPage.gql'
import PageContent from '../../components/PageContent'
import apolloClient from '../../lib/apolloClient'

;('')
type Props = { url: string } & DefaultPageQuery
type RouteProps = { url: string[] }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<FullPageShellProps, Props, RouteProps>

function AppShellTestIndex(props: Props) {
  const { url, pages } = props
  const title = `Testpage ${url?.charAt(0).toUpperCase() + url?.slice(1)}`

  return (
    <>
      <Container>
        {/* {url === 'index' ? (
          <PageLink href='/test/deeper' passHref>
            <Button variant='outlined' color='secondary'>
              Sibling
            </Button>
          </PageLink>
        ) : (
          <PageLink href='/test/index' passHref>
            <Button variant='outlined' color='secondary'>
              Index
            </Button>
          </PageLink>
        )} */}

        <PageLink href='/test/sheet/bottom-sheet' passHref>
          <Button variant='outlined' color='secondary'>
            Bottom Sheet (default)
          </Button>
        </PageLink>

        {/* <PageLink href='/test/overlay/left' passHref>
          <Button variant='outlined' color='secondary'>
            Left Sheet
          </Button>
        </PageLink>
        <PageLink href='/test/overlay/right' passHref>
          <Button variant='outlined' color='secondary'>
            Right Sheet
          </Button>
        </PageLink>
        <PageLink href='/test/overlay/bottom' passHref>
          <Button variant='outlined' color='secondary'>
            Bottom Sheet
          </Button>
        </PageLink>
        <PageLink href='/test/overlay/top' passHref>
          <Button variant='outlined' color='secondary'>
            Top Sheet
          </Button>
        </PageLink>
        <PageLink href='/test/slider' passHref>
          <Button variant='outlined' color='secondary'>
            Slider
          </Button>
        </PageLink> */}

        <div style={{ marginLeft: url === 'index' ? 0 : 150 }}>
          <m.img
            src='/manifest/icon.png'
            alt=''
            layoutId='img1'
            width='183'
            height='172'
            style={{ position: 'relative', marginLeft: 10 }}
            transition={{ type: 'tween' }}
            initial={{ zIndex: 0 }}
            animate={{ zIndex: 5 }}
            exit={{ zIndex: 0 }}
          />
          <m.img
            src='/manifest/icon.png'
            alt=''
            layoutId='img2'
            width='183'
            height='172'
            style={{ position: 'relative', marginLeft: 10 }}
            transition={{ type: 'tween' }}
            initial={{ zIndex: 0 }}
            animate={{
              zIndex: 5,
              filter: url === 'index' ? 'hue-rotate(0deg)' : 'hue-rotate(45deg)',
            }}
            exit={{ zIndex: 0 }}
          />
        </div>
      </Container>
      <PageContent {...pages?.[0]} />

      <Container>
        <DebugSpacer height={2000} />
      </Container>

      {/* <MessageSnackbar
        open
        variant='pill'
        color='default'
        action={
          <Button
            size='medium'
            variant='pill'
            color='secondary'
            endIcon={<SvgImage src={iconChevronRight} shade='inverted' alt='chevron right' />}
          >
            View shopping cart
          </Button>
        }
      >
        <div>
          <SvgImage src={iconCheckmark} loading='eager' alt='checkmark' />
          <strong>Blissful Brush</strong>&nbsp;has been added to your shopping cart!
        </div>
      </MessageSnackbar> */}
    </>
  )
}

AppShellTestIndex.pageOptions = {
  SharedComponent: FullPageShell,
  sharedKey: () => 'page',
} as PageOptions

export default AppShellTestIndex

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  const urls = ['index', 'other']

  const paths = locales
    .map((locale) => urls.map((url) => ({ params: { url: [url] }, locale })))
    .flat(1)

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async ({ params, locale }) => {
  const url = params?.url.join('/') ?? ''

  const client = apolloClient(locale, true)
  const staticClient = apolloClient(locale)

  const conf = client.query({ query: StoreConfigDocument })
  const page = staticClient.query({
    query: DefaultPageDocument,
    variables: {
      url: `/test/${url}`,
      rootCategory: (await conf).data.storeConfig?.root_category_uid ?? '',
    },
  })

  return {
    props: {
      url,
      ...(await page).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
