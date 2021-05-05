import { useQuery } from '@apollo/client'
import { TextField } from '@material-ui/core'
import { useCartQuery } from '@reachdigital/magento-cart/CurrentCartId/useCartQuery'
import AddressFields from '@reachdigital/magento-customer/AddressFields'
import { CustomerDocument } from '@reachdigital/magento-customer/Customer.gql'
import NameFields from '@reachdigital/magento-customer/NameFields'
import { StoreConfigDocument } from '@reachdigital/magento-store'
import { CountryRegionsQuery } from '@reachdigital/magento-store/CountryRegions.gql'
import ApolloErrorAlert from '@reachdigital/next-ui/Form/ApolloErrorAlert'
import InputCheckmark from '@reachdigital/next-ui/Form/InputCheckmark'
import useFormStyles from '@reachdigital/next-ui/Form/useFormStyles'
import {
  useFormAutoSubmit,
  useFormGqlMutation,
  useFormPersist,
  phonePattern,
  useFormCompose,
} from '@reachdigital/react-hook-form'
import { AnimatePresence } from 'framer-motion'
import React, { useRef } from 'react'
import { GetShippingAddressDocument } from './GetShippingAddress.gql'
import { ShippingAddressFormDocument } from './ShippingAddressForm.gql'

type ShippingAddressFormProps = CountryRegionsQuery

export default function ShippingAddressForm(props: ShippingAddressFormProps) {
  const { countries } = props
  const classes = useFormStyles()
  const ref = useRef<HTMLFormElement>(null)
  const { data: cartQuery } = useCartQuery(GetShippingAddressDocument)
  const { data: config } = useQuery(StoreConfigDocument)
  const { data: customerQuery } = useQuery(CustomerDocument, { fetchPolicy: 'cache-only' })

  const shopCountry = config?.storeConfig?.locale?.split('_')?.[1].toUpperCase()

  const currentAddress = cartQuery?.cart?.shipping_addresses?.[0]
  const currentCustomer = customerQuery?.customer
  const currentCountryCode = currentAddress?.country.code ?? shopCountry ?? 'NLD'

  const form = useFormGqlMutation(ShippingAddressFormDocument, {
    defaultValues: {
      cartId: cartQuery?.cart?.id,
      // todo(paales): change to something more sustainable
      firstname: currentAddress?.firstname ?? currentCustomer?.firstname ?? undefined, // todo: allow for null values in defaultValues
      lastname: currentAddress?.lastname ?? currentCustomer?.lastname ?? undefined,
      telephone:
        currentAddress?.telephone !== '000 - 000 0000' ? currentAddress?.telephone : undefined,
      city: currentAddress?.city,
      company: currentAddress?.company,
      postcode: currentAddress?.postcode ?? '',
      street: currentAddress?.street?.[0] ?? undefined,
      houseNumber: currentAddress?.street?.[1] ?? undefined,
      addition: currentAddress?.street?.[2] ?? undefined,
      regionId: currentAddress?.region?.region_id,
      countryCode: currentCountryCode, // todo: replace by the default shipping country of the store + geoip
    },
    mode: 'onChange',
    onBeforeSubmit: (variables) => {
      const regionId = countries
        ?.find((country) => country?.two_letter_abbreviation === variables.countryCode)
        ?.available_regions?.find((region) => region?.id === variables.regionId)?.id

      return {
        ...variables,
        telephone: variables.telephone || '000 - 000 0000',
        regionId,
        saveInAddressBook: true,
        customerNote: '',
      }
    },
  })
  const { muiRegister, handleSubmit, valid, formState, required, error } = form
  const submit = handleSubmit(() => {})

  useFormPersist({ form, name: 'ShippingAddressForm' })
  useFormCompose({ form, name: 'ShippingAddressForm', submit })

  const autoSubmitting = useFormAutoSubmit({
    form,
    submit,
    fields: ['postcode', 'countryCode', 'regionId'],
  })

  const disableFields = formState.isSubmitting && !autoSubmitting

  return (
    <form onSubmit={submit} noValidate className={classes.form} ref={ref}>
      <AnimatePresence initial={false}>
        <NameFields form={form} key='name' disabled={disableFields} />
        <AddressFields
          form={form}
          key='addressfields'
          disabled={disableFields}
          countries={countries}
        />

        <div className={classes.formRow} key='telephone'>
          <TextField
            variant='outlined'
            type='text'
            error={!!formState.errors.telephone}
            required={required.telephone}
            label='Telephone'
            {...muiRegister('telephone', {
              required: required.telephone,
              pattern: { value: phonePattern, message: 'Invalid phone number' },
            })}
            helperText={formState.isSubmitted && formState.errors.telephone?.message}
            disabled={disableFields}
            InputProps={{
              endAdornment: <InputCheckmark show={valid.telephone} />,
            }}
          />
        </div>

        <ApolloErrorAlert error={error} />
      </AnimatePresence>
    </form>
  )
}
