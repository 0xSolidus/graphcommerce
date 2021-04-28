import { useQuery } from '@apollo/client'
import { Container, NoSsr } from '@material-ui/core'
import { ArrowForwardIos } from '@material-ui/icons'
import { PageOptions } from '@reachdigital/framer-next-pages'
import { ClientCartDocument } from '@reachdigital/magento-cart/ClientCart.gql'
import BillingAddressForm from '@reachdigital/magento-cart/billing-address/BillingAddressForm'
import PaymentMethodButton from '@reachdigital/magento-cart/payment-method/PaymentMethodButton'
import PaymentMethodContextProvider from '@reachdigital/magento-cart/payment-method/PaymentMethodContext'
import PaymentMethodError from '@reachdigital/magento-cart/payment-method/PaymentMethodError'
import PaymentMethodOptions from '@reachdigital/magento-cart/payment-method/PaymentMethodOptions'
import PaymentMethodToggle from '@reachdigital/magento-cart/payment-method/PaymentMethodToggle'
import braintree_local_payment from '@reachdigital/magento-payment-braintree/BraintreeLocalPayment'
import checkmo from '@reachdigital/magento-payment/Checkmo'
import {
  CountryRegionsDocument,
  CountryRegionsQuery,
} from '@reachdigital/magento-store/CountryRegions.gql'
import PageMeta from '@reachdigital/magento-store/PageMeta'
import { StoreConfigDocument } from '@reachdigital/magento-store/StoreConfig.gql'
import AnimatedRow from '@reachdigital/next-ui/AnimatedRow'
import useFormStyles from '@reachdigital/next-ui/Form/useFormStyles'
import { GetStaticProps } from '@reachdigital/next-ui/Page/types'
import { ComposedForm } from '@reachdigital/react-hook-form'
import { AnimatePresence } from 'framer-motion'
import React, { useRef } from 'react'
import { FullPageShellProps } from '../../components/AppShell/FullPageShell'
import SheetShell, { SheetShellProps } from '../../components/AppShell/SheetShell'
import apolloClient from '../../lib/apolloClient'

type Props = CountryRegionsQuery
type GetPageStaticProps = GetStaticProps<FullPageShellProps, Props>

function PaymentPage({ countries }: Props) {
  const classes = useFormStyles()
  const addressForm = useRef<() => Promise<boolean>>()
  const methodForm = useRef<() => Promise<boolean>>()
  const { data: clientCart } = useQuery(ClientCartDocument, { ssr: false })
  const forceSubmit = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      if (!addressForm.current || !methodForm.current) return
      await Promise.all([addressForm.current(), methodForm.current()])
    })()
  }

  return (
    <Container maxWidth='md'>
      <ComposedForm>
        <PaymentMethodContextProvider
          modules={{ braintree_local_payment, checkmo }}
          available_payment_methods={clientCart?.cart?.available_payment_methods}
        >
          <PageMeta title='Payment' metaDescription='Cart Items' metaRobots={['noindex']} />

          <NoSsr>
            <AnimatePresence initial={false}>
              <PaymentMethodToggle key='toggle' />

              <PaymentMethodOptions key='options' />

              <PaymentMethodError key='error' />

              <BillingAddressForm />

              <AnimatedRow className={classes.formRow} key='next'>
                <div className={classes.formRow}>
                  <PaymentMethodButton
                    key='button'
                    type='submit'
                    color='secondary'
                    variant='pill'
                    size='large'
                    onClick={forceSubmit}
                    endIcon={<ArrowForwardIos fontSize='inherit' />}
                  >
                    Pay
                  </PaymentMethodButton>
                </div>
              </AnimatedRow>
            </AnimatePresence>
          </NoSsr>
        </PaymentMethodContextProvider>
      </ComposedForm>
    </Container>
  )
}

const pageOptions: PageOptions<SheetShellProps> = {
  overlayGroup: 'checkout',
  SharedComponent: SheetShell,
  sharedKey: () => 'checkout',
  sharedProps: { variant: 'bottom', size: 'max' },
}
PaymentPage.pageOptions = pageOptions

export default PaymentPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = apolloClient(locale, true)
  const staticClient = apolloClient(locale)

  const conf = client.query({ query: StoreConfigDocument })
  const countryRegions = staticClient.query({ query: CountryRegionsDocument })

  return {
    props: {
      ...(await countryRegions).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
