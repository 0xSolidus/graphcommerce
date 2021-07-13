import { useQuery } from '@apollo/client'
import { Container, NoSsr } from '@material-ui/core'
import { PageOptions } from '@reachdigital/framer-next-pages'
import {
  ApolloCustomerErrorFullPage,
  ChangeNameForm,
  CustomerDocument,
} from '@reachdigital/magento-customer'
import { PageMeta, StoreConfigDocument } from '@reachdigital/magento-store'
import { IconHeader, GetStaticProps, SectionContainer, iconId } from '@reachdigital/next-ui'
import React from 'react'
import SheetShell, { SheetShellProps } from '../../../components/AppShell/SheetShell'
import apolloClient from '../../../lib/apolloClient'

type GetPageStaticProps = GetStaticProps<SheetShellProps>

function AccountNamePage() {
  const { loading, data, error } = useQuery(CustomerDocument)
  const customer = data?.customer

  if (loading) return <></>
  if (error)
    return (
      <ApolloCustomerErrorFullPage
        error={error}
        signInHref='/account/signin'
        signUpHref='/account/signin'
      />
    )

  return (
    <NoSsr>
      <Container maxWidth='md'>
        <PageMeta title='Name' metaDescription='Update your name' metaRobots={['noindex']} />

        <IconHeader src={iconId} title='Name' alt='name' size='large' />
        <SectionContainer labelLeft='Name'>
          {customer && (
            <ChangeNameForm
              prefix={customer.prefix ?? ''}
              firstname={customer.firstname ?? ''}
              lastname={customer.lastname ?? ''}
            />
          )}
        </SectionContainer>
      </Container>
    </NoSsr>
  )
}

const pageOptions: PageOptions<SheetShellProps> = {
  overlayGroup: 'account',
  SharedComponent: SheetShell,
  sharedKey: () => 'account-name',
}
AccountNamePage.pageOptions = pageOptions

export default AccountNamePage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = apolloClient(locale, true)
  const conf = client.query({ query: StoreConfigDocument })

  return {
    props: {
      apolloState: await conf.then(() => client.cache.extract()),
      variant: 'bottom',
      size: 'max',
      backFallbackHref: '/account',
      backFallbackTitle: 'Account',
    },
  }
}
