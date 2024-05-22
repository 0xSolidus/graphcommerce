import { Image } from '@graphcommerce/image'
import { useDisplayInclTax } from '@graphcommerce/magento-cart/hooks'
import { Money } from '@graphcommerce/magento-store'
import {
  ActionCard,
  ActionCardProps,
  responsiveVal,
  filterNonNullableKeys,
} from '@graphcommerce/next-ui'
import { Box, Link } from '@mui/material'
import { CartItemFragment } from '../../Api/CartItem.gql'
import { RemoveItemFromCart } from '../RemoveItemFromCart/RemoveItemFromCart'
import { UpdateItemQuantity } from '../UpdateItemQuantity/UpdateItemQuantity'

export type CartItemActionCardProps = { cartItem: CartItemFragment; readOnly?: boolean } & Omit<
  ActionCardProps,
  'value' | 'image' | 'price' | 'title' | 'action'
>

export const productImageSizes = {
  small: responsiveVal(60, 80),
  medium: responsiveVal(60, 80),
  large: responsiveVal(100, 120),
}

const typographySizes = {
  small: 'body2',
  medium: 'body1',
  large: 'subtitle1',
}

export function CartItemActionCard(props: CartItemActionCardProps) {
  const { cartItem, sx = [], size = 'responsive', readOnly = false, ...rest } = props
  const { uid, quantity, prices, errors, product } = cartItem
  const { name, thumbnail, url_key } = product

  const inclTaxes = useDisplayInclTax()

  let price: number | null | undefined

  if (inclTaxes) {
    if (prices?.price_including_tax) {
      price = prices.price_including_tax.value
    } else {
      const rowTotalIncludingTax = prices?.row_total_including_tax?.value ?? 0
      price = rowTotalIncludingTax / quantity
    }
  } else {
    price = prices?.price.value
  }

  return (
    <ActionCard
      value={uid}
      sx={[
        (theme) => ({
          '&.ActionCard-root': {
            px: 0,
            py: theme.spacings.xs,
          },
          '& .MuiBox-root': {
            justifyContent: 'space-between',
            alignItems: 'stretch',
          },
          '&.sizeSmall': {
            px: 0,
          },
          '&.sizeResponsive': {
            [theme.breakpoints.down('md')]: {
              px: 0,
            },
          },
          '& .ActionCard-end': {
            justifyContent: readOnly ? 'center' : 'space-between',
          },
          '& .ActionCard-action': {
            pr: readOnly ? 0 : theme.spacings.xs,
          },
          '& .ActionCard-image': {
            alignSelf: 'flex-start',
          },
          '& .ActionCard-secondaryAction': {
            typography:
              size === 'responsive'
                ? {
                    xs: typographySizes.small,
                    md: typographySizes.medium,
                    lg: typographySizes.large,
                  }
                : typographySizes[size],
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            mt: 1,
            gap: '10px',
            justifyContent: 'start',
          },
          '& .ActionCard-price': {
            typography:
              size === 'responsive'
                ? {
                    xs: typographySizes.small,
                    md: typographySizes.medium,
                    lg: typographySizes.large,
                  }
                : typographySizes[size],
            pr: readOnly ? 0 : theme.spacings.xs,
            mb: { xs: 0.5, sm: 0 },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      image={
        thumbnail?.url && (
          <Image
            layout='fill'
            src={thumbnail?.url}
            sx={{
              width:
                size === 'responsive'
                  ? {
                      xs: productImageSizes.small,
                      md: productImageSizes.medium,
                      lg: productImageSizes.large,
                    }
                  : productImageSizes[size],
              height:
                size === 'responsive'
                  ? {
                      xs: productImageSizes.small,
                      md: productImageSizes.medium,
                      lg: productImageSizes.large,
                    }
                  : productImageSizes[size],
              display: 'block',
              borderRadius: 1,
              objectFit: 'contain',
            }}
            sizes={size === 'responsive' ? productImageSizes.small : productImageSizes[size]}
          />
        )
      }
      title={
        url_key ? (
          <Link
            href={url_key}
            underline='hover'
            sx={{
              color: 'inherit',
              flexWrap: 'nowrap',
              maxWidth: 'max-content',
            }}
          >
            {name}
          </Link>
        ) : (
          name
        )
      }
      secondaryAction={
        <>
          {readOnly ? quantity : <UpdateItemQuantity uid={uid} quantity={quantity} />}
          {' ⨉ '}

          <Money value={price} currency={prices?.price.currency} />
        </>
      }
      price={<Money {...(inclTaxes ? prices?.row_total_including_tax : prices?.row_total)} />}
      action={
        !readOnly && (
          <RemoveItemFromCart
            {...cartItem}
            buttonProps={{ size: size === 'responsive' ? 'large' : size }}
          />
        )
      }
      size={size}
      after={filterNonNullableKeys(errors).map((error) => (
        <Box sx={{ color: 'error.main', typography: 'caption' }} key={error.message}>
          {error.message}
        </Box>
      ))}
      {...rest}
    />
  )
}
