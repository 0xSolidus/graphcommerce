import { ApolloProvider, useQuery } from '@apollo/client'
import { LinguiProvider } from '@graphcommerce/lingui-next'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { App, AppProps, GlobalHead } from '@graphcommerce/next-ui'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { useRouter } from 'next/router'
import React from 'react'
import { lightTheme } from '../components/Theme/ThemedProvider'
import apolloClient from '../lib/apolloClientBrowser'

export default function ThemedApp(props: AppProps) {
  const { pageProps } = props
  const { locale } = useRouter()

  const client = apolloClient(locale, true, pageProps.apolloState)
  const storeConfig = useQuery(StoreConfigDocument, { client })
  const name = storeConfig.data?.storeConfig?.store_name ?? ''

  return (
    <>
      <GlobalHead name={name} />
      <ApolloProvider client={client}>
        <LinguiProvider loader={(l) => import(`../locales/${l}.po`)}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <App {...props} />
          </ThemeProvider>
        </LinguiProvider>
      </ApolloProvider>
    </>
  )
}
