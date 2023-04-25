import {
  extendableComponent,
  DesktopHeaderBadge,
  IconSvg,
  useFabSize,
  iconCompare,
  useScrollY,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import {
  alpha,
  Fab,
  FabProps,
  styled,
  useTheme,
  Box,
  SxProps,
  Theme,
  NoSsr,
  Badge,
} from '@mui/material'
import { m, useTransform } from 'framer-motion'
import React from 'react'
import { useCompareList } from '../hooks/useCompareList'

export type CompareFabProps = {
  icon?: React.ReactNode
  sx?: SxProps<Theme>
} & Pick<FabProps, 'color' | 'size' | 'variant'>

type CompareFabContentProps = CompareFabProps & { total_quantity: number }

const MotionDiv = styled(m.div)({})

const MotionFab = m(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.forwardRef<any, Omit<FabProps, 'style' | 'onDrag'>>((props, ref) => (
    <Fab variant='extended' {...props} ref={ref} />
  )),
)

const { classes } = extendableComponent('CompareFab', ['root', 'compare', 'shadow'] as const)

function CompareFabContent(props: CompareFabContentProps) {
  const { total_quantity, icon, sx = [], ...fabProps } = props
  const scrollY = useScrollY()
  const opacity = useTransform(scrollY, [50, 60], [0, 1])

  const compareIcon = icon ?? <IconSvg src={iconCompare} size='large' />
  const fabIconSize = useFabSize('responsive')

  return (
    <Box
      className={classes.root}
      sx={[{ position: 'relative', height: fabIconSize }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <MotionFab
        href='/compare'
        className={classes.compare}
        aria-label={i18n._(/* i18n */ 'Compare')}
        color='inherit'
        size='responsive'
        variant='extended'
        sx={(theme) => ({
          width: 'unset',
          backgroundColor: `${theme.palette.background.paper} !important`,
          [theme.breakpoints.down('md')]: {},
        })}
        {...fabProps}
      >
        <Badge
          color='primary'
          variant='standard'
          overlap='circular'
          badgeContent={total_quantity}
          sx={{
            paddingRight: 2,
            '& .MuiBadge-badge': {
              right: 5,
              top: 5,
            },
          }}
        >
          {compareIcon} Compare
        </Badge>
      </MotionFab>

      <MotionDiv
        className={classes.shadow}
        sx={(theme) => ({
          pointerEvents: 'none',
          borderRadius: '99em',
          position: 'absolute',
          height: '100%',
          width: '100%',
          boxShadow: 6,
          top: 0,
          [theme.breakpoints.down('md')]: {
            opacity: '1 !important',
          },
        })}
        style={{ opacity }}
      />
    </Box>
  )
}

export function CompareFab(props: CompareFabProps) {
  const compareList = useCompareList()
  return (
    <NoSsr fallback={<CompareFabContent total_quantity={0} {...props} />}>
      <CompareFabContent
        total_quantity={compareList.data?.compareList?.item_count ?? 0}
        {...props}
      />
    </NoSsr>
  )
}
