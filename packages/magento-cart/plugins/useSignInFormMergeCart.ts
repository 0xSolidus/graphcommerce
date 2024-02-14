import { useApolloClient } from '@graphcommerce/graphql'
import type { useSignInForm } from '@graphcommerce/magento-customer/hooks/useSignInForm'
import type { MethodPlugin } from '@graphcommerce/next-config'
import { useCurrentCartId, useAssignCurrentCartId } from '../hooks'
import { CustomerCartDocument } from '../hooks/CustomerCart.gql'
import { UseMergeCustomerCartDocument } from '../hooks/UseMergeCustomerCart.gql'

export const func = 'useSignInForm'
export const exported = '@graphcommerce/magento-customer/hooks/useSignInForm'

const useSignInFormMergeCart: MethodPlugin<typeof useSignInForm> = (useSignInForm, options) => {
  const { currentCartId } = useCurrentCartId()
  const client = useApolloClient()
  const assignCurrentCartId = useAssignCurrentCartId()

  return useSignInForm({
    ...options,
    onComplete: async (data, variables) => {
      await options.onComplete?.(data, variables)

      const destinationCartId = (
        await client.query({ query: CustomerCartDocument, fetchPolicy: 'network-only' })
      ).data.customerCart.id

      // If we don't have a customer cart, we're done
      // If the vistor cart is the same as the customer cart, we're done
      if (!destinationCartId || currentCartId === destinationCartId) return

      // Assign the customer cart as the new cart id
      assignCurrentCartId(destinationCartId)

      if (currentCartId) {
        await client
          .mutate({
            mutation: UseMergeCustomerCartDocument,
            variables: { sourceCartId: currentCartId, destinationCartId },
          })
          // We're not handling exceptions here:
          // If the merge returns an error, we'll use the customer cart without merging the guest cart.
          .catch((e) => console.error('Error merging carts', e))
      }
    },
  })
}

export const plugin = useSignInFormMergeCart
