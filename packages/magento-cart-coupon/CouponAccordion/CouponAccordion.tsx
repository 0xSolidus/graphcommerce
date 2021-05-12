import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { useCartQuery } from '@reachdigital/magento-cart'
import AnimatedRow from '@reachdigital/next-ui/AnimatedRow'
import { UseStyles } from '@reachdigital/next-ui/Styles'
import clsx from 'clsx'
import { m, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import ApplyCouponForm from '../ApplyCouponForm/ApplyCouponForm'
import RemoveCouponForm from '../RemoveCouponForm/RemoveCouponForm'
import { GetCouponDocument } from './GetCoupon.gql'

const useStyles = makeStyles((theme: Theme) => ({
  accordion: {
    '&:before': {
      background: 'none',
    },
    boxShadow: 'none',
    border: '1px solid #ededed',
    borderRadius: 8,
  },
  button: {
    padding: theme.spacings.xs,
    width: '100%',
    '& .MuiButton-label': {
      display: 'flex',
      justifyContent: 'flex-start',
      '& span:last-child': {
        marginLeft: 'auto',
      },
    },
    '& > span': {
      display: 'inline',
      '& > h6': {
        textAlign: 'left',
        marginRight: theme.spacings.sm,
      },
    },
  },
  couponFormWrap: {
    background: 'rgba(0,0,0,0.04)',
    padding: theme.spacings.xs,
  },
  buttonOpen: {
    '&.MuiButton-root': {
      background: 'rgba(0,0,0,0.04)',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
}))

export type CouponAccordionProps = UseStyles<typeof useStyles>

export default function CouponAccordion(props: CouponAccordionProps) {
  const classes = useStyles(props)
  const { data } = useCartQuery(GetCouponDocument)
  const [open, setOpen] = useState<boolean>(false)

  if (!data?.cart?.id) return null

  const coupon = data?.cart?.applied_coupons?.[0]?.code

  return (
    <AnimatedRow key='discount-codes'>
      <m.div layout className={classes.accordion}>
        <m.div layout>
          <Button
            onClick={() => setOpen(!open)}
            className={clsx(classes.button, { [classes.buttonOpen]: open })}
            endIcon={open ? <ExpandLess /> : <ExpandMore />}
          >
            <Typography variant='h6'>Discount code</Typography>
            {coupon && <RemoveCouponForm {...data.cart} />}
          </Button>
        </m.div>

        <AnimatePresence>
          {open && (
            <AnimatedRow key='discount-codes-form-wrap'>
              <m.div layout='position' className={classes.couponFormWrap}>
                {!coupon && <ApplyCouponForm />}
                {coupon && <i>Only one active coupon allowed</i>}
              </m.div>
            </AnimatedRow>
          )}
        </AnimatePresence>
      </m.div>
    </AnimatedRow>
  )
}
