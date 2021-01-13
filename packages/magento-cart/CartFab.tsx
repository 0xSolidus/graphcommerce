import { useQuery } from '@apollo/client'
import { Badge, Fab, IconButton, NoSsr } from '@material-ui/core'
import CartIcon from '@material-ui/icons/ShoppingCartOutlined'
import PageLink from '@reachdigital/next-ui/PageTransition/PageLink'
import React from 'react'
import { ClientCartDocument } from './ClientCart.gql'

type CartFabProps = {
  qty?: number
  asIcon?: boolean
  icon?: React.ReactNode
}

function CartFabContent(props: CartFabProps) {
  const { qty, asIcon, icon } = props

  const badge = (
    <Badge badgeContent={qty || 0} color='primary' variant='dot'>
      {icon ?? <CartIcon />}
    </Badge>
  )

  return (
    <PageLink href='/cart'>
      {asIcon ? (
        <IconButton aria-label='Cart' color='inherit'>
          {badge}
        </IconButton>
      ) : (
        <Fab aria-label='Cart' color='inherit' size='medium'>
          {badge}
        </Fab>
      )}
    </PageLink>
  )
}

export default function CartFab(props: CartFabProps) {
  const { data: cartData } = useQuery(ClientCartDocument)

  return (
    <NoSsr fallback={<CartFabContent {...props} />}>
      <CartFabContent qty={cartData?.cart?.total_quantity} {...props} />
    </NoSsr>
  )
}
