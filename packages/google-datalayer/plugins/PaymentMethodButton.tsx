import { useCartQuery } from '@graphcommerce/magento-cart'
import { PaymentMethodButtonProps } from '@graphcommerce/magento-cart-payment-method'
import { GetPaymentMethodContextDocument } from '@graphcommerce/magento-cart-payment-method/PaymentMethodContext/GetPaymentMethodContext.gql'
import { IfConfig, PluginProps } from '@graphcommerce/next-config'
import { addPaymentInfo } from '../events/add_payment_info'

export const component = 'PaymentMethodButton'
export const exported = '@graphcommerce/magento-cart-payment-method'
export const ifConfig: IfConfig = 'analytics'

// @todo This plugin can probably be migrated to the actual form that is submitted.
function PaymentMethodButton(props: PluginProps<PaymentMethodButtonProps>) {
  const { Prev, onSubmitSuccessful, ...rest } = props
  const methodContext = useCartQuery(GetPaymentMethodContextDocument)

  return (
    <Prev
      {...rest}
      onSubmitSuccessful={() => {
        addPaymentInfo(methodContext.data?.cart)
        return onSubmitSuccessful?.()
      }}
    />
  )
}

export const Plugin = PaymentMethodButton
