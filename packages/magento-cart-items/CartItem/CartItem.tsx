import { Badge, makeStyles, Theme } from '@material-ui/core'
import { useProductLink } from '@reachdigital/magento-product'
import { Money } from '@reachdigital/magento-store'
import PictureResponsiveNext from '@reachdigital/next-ui/PictureResponsiveNext'
import { UseStyles } from '@reachdigital/next-ui/Styles'
import responsiveVal from '@reachdigital/next-ui/Styles/responsiveVal'
import clsx from 'clsx'
import PageLink from 'next/link'
import React, { PropsWithChildren } from 'react'
import { CartItemFragment } from '../Api/CartItem.gql'
import DeliveryLabel from '../DeliveryLabel/DeliveryLabel'
import RemoveItemFromCartFab from '../RemoveItemFromCart/RemoveItemFromCartFab'
import UpdateItemQuantity from '../UpdateItemQuantity/UpdateItemQuantity'

type CartItemBaseProps = CartItemFragment

const rowImageSize = responsiveVal(70, 125)
const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'grid',
      gridTemplate: `
      "picture itemName itemName itemName"
      "picture itemOptions itemOptions itemOptions"
      "picture itemPrice quantity rowPrice"
        `,
      gridTemplateColumns: `${rowImageSize} 1fr minmax(120px, 1fr) 1fr`,
      columnGap: theme.spacings.sm,
      alignItems: 'baseline',
      ...theme.typography.body1,
      marginBottom: theme.spacings.lg,
      marginTop: theme.spacings.md,
      [theme.breakpoints.up('sm')]: {
        gridTemplate: `
        "picture itemName itemName itemName itemName"
        "picture itemOptions itemPrice quantity rowPrice"
      `,
        gridTemplateColumns: `${rowImageSize} 4fr 1fr minmax(120px, 1fr) minmax(75px, 1fr)`,
        marginBottom: theme.spacings.md,
      },
    },
    itemWithoutOptions: {
      display: 'grid',
      gridTemplate: `
      "picture itemName itemName itemName"
      "picture itemPrice quantity rowPrice"`,
      alignItems: 'center',
      gridTemplateColumns: `${rowImageSize} 1fr minmax(120px, 1fr) 1fr`,
      [theme.breakpoints.up('sm')]: {
        gridTemplate: `
        "picture itemName itemPrice quantity rowPrice"
      `,
        gridTemplateColumns: `${rowImageSize} 4fr 1fr minmax(120px, 1fr) minmax(75px, 1fr)`,
      },
    },
    picture: {
      gridArea: 'picture',
      width: rowImageSize,
      height: rowImageSize,
      padding: responsiveVal(5, 10),
      border: `1px solid rgba(0,0,0,0.15)`,
      borderRadius: '50%',
    },
    badge: {
      '& > button': {
        background: theme.palette.text.primary,
        color: theme.palette.common.white,
        transition: 'opacity .15s ease',
        '&:hover, &:active, &:visited': {
          background: theme.palette.text.primary,
          opacity: 0.75,
        },
        '& .MuiSvgIcon-root': {
          fontSize: 24,
        },
        [theme.breakpoints.down('sm')]: {
          width: 30,
          height: 30,
          minHeight: 'unset',
          '& .MuiSvgIcon-root': {
            fontSize: 20,
          },
        },
      },
    },
    pictureSpacing: {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      flexShrink: 0,
      userSelect: 'none',
      borderRadius: '50%',
      justifyContent: 'center',
      backgroundColor: 'rgb(248,248,248)',
    },
    pictureResponsive: {
      gridColumn: 1,
      backgroundColor: theme.palette.background.paper,
      objectFit: 'cover',
      display: 'block',
      transform: 'scale(1.1)',
    },
    productLink: {
      display: 'block',
      width: '100%',
    },
    itemName: {
      ...theme.typography.h5,
      fontWeight: 500,
      gridArea: 'itemName',
      color: theme.palette.text.primary,
      textDecoration: 'none',
      flexWrap: 'nowrap',
      maxWidth: 'max-content',
    },
    itemNameWithOptions: {
      alignSelf: 'flex-end',
    },
    itemPrice: {
      gridArea: 'itemPrice',
      textAlign: 'left',
      color: theme.palette.primary.mutedText,
    },
    quantity: {
      gridArea: 'quantity',
      justifySelf: 'center',
    },
    quantityWithOptions: {
      transform: 'translateY(-6px)',
    },
    rowPrice: {
      gridArea: 'rowPrice',
      textAlign: 'right',
    },
    cellNoOptions: {
      textAlign: 'left',
    },
  }),
  { name: 'CartItem' },
)

export type CartItemProps = PropsWithChildren<CartItemBaseProps> &
  UseStyles<typeof useStyles> & { withOptions?: boolean }

export default function CartItem(props: CartItemProps) {
  const { product, uid, prices, quantity, children, withOptions } = props
  const { name } = product
  const classes = useStyles()
  const productLink = useProductLink(product)

  return (
    <div className={clsx(classes.root, !withOptions && classes.itemWithoutOptions)}>
      <Badge
        color='default'
        badgeContent={<RemoveItemFromCartFab uid={uid} className={classes.badge} />}
        component='div'
        className={classes.picture}
        overlap='circle'
      >
        <PageLink href={productLink}>
          <a className={classes.productLink}>
            <div className={classes.pictureSpacing}>
              {product?.thumbnail?.url && product.thumbnail.label && (
                <PictureResponsiveNext
                  alt={product.thumbnail.label ?? ''}
                  width={104}
                  height={86}
                  src={product.thumbnail.url ?? ''}
                  type='image/jpeg'
                  className={classes.pictureResponsive}
                />
              )}
            </div>
          </a>
        </PageLink>
      </Badge>

      <PageLink href={productLink}>
        <a className={clsx(classes.itemName, withOptions && classes.itemNameWithOptions)}>
          {name}
          <DeliveryLabel />
        </a>
      </PageLink>

      <div className={classes.itemPrice}>
        <Money {...prices?.price} />
      </div>

      <div className={clsx(classes.quantity, withOptions && classes.quantityWithOptions)}>
        <UpdateItemQuantity uid={uid} quantity={quantity} />
      </div>

      <div className={classes.rowPrice}>
        <Money {...prices?.row_total_including_tax} /> <br />
      </div>

      {children}
    </div>
  )
}
