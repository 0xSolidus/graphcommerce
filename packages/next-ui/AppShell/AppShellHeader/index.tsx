import { Fab, makeStyles, Theme } from '@material-ui/core'
import { usePageContext, usePageRouter } from '@reachdigital/framer-next-pages'
import clsx from 'clsx'
import { m, MotionValue, useMotionValue, useTransform } from 'framer-motion'
import PageLink from 'next/link'
import React, { useEffect } from 'react'
import Button from '../../Button'
import { UseStyles } from '../../Styles'
import responsiveVal from '../../Styles/responsiveVal'
import SvgImage from '../../SvgImage'
import { iconChevronLeft, iconClose } from '../../icons'
import useAppShellHeaderContext from './useAppShellHeaderContext'

export type AppShellHeaderProps = {
  children?: React.ReactNode
  primary?: React.ReactNode
  secondary?: React.ReactNode
  divider?: React.ReactNode
  /* When a logo is given, children should be given too */
  logo?: React.ReactNode
  scrollY: MotionValue<number>
  hideClose?: boolean
  scrolled?: boolean
  dragIndicator?: React.ReactNode
  additional?: React.ReactNode
  backFallbackHref?: string | null
  backFallbackTitle?: string | null
} & UseStyles<typeof useStyles>

const useStyles = makeStyles(
  (theme: Theme) => ({
    divider: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    sheetHeader: {
      position: 'sticky',
      top: 0,
      background: theme.palette.background.default,
      marginBottom: 32,
      zIndex: 98,
    },
    sheetHeaderScrolled: {
      marginTop: -60,
    },
    sheetHeaderActions: {
      display: 'grid',
      gridTemplateColumns: `1fr auto 1fr`,
      gridAutoFlow: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `8px ${theme.page.horizontal} 8px`,
      [theme.breakpoints.up('md')]: {
        padding: `12px ${theme.page.horizontal} 12px`,
      },
      [theme.breakpoints.down('sm')]: {
        '& > div > .MuiFab-sizeSmall': {
          marginLeft: -12,
          marginRight: -12,
        },
        '& > div > .MuiButtonBase-root': {
          minWidth: 'unset',
          marginRight: -8,
          marginLeft: -8,
        },
      },
    },
    sheetHeaderActionRight: {
      justifySelf: 'flex-end',
    },
    sheetHeaderNoTitle: {
      pointerEvents: 'none',
      background: 'transparent',
    },
    innerContainer: {
      display: 'grid',
      textAlign: 'center',
    },
    innerContainerItem: {
      gridColumn: 1,
      gridRow: 1,
      alignSelf: 'center',
      ...theme.typography.h5,
    },
    fab: {
      [theme.breakpoints.down('sm')]: {
        boxShadow: 'none',
      },
    },
    childs: {
      marginLeft: 12,
      marginRight: 12,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    logoContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingTop: responsiveVal(16, 30),
    },
    subLogo: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    backButton: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      '&:hover': {
        background: theme.palette.background.highlight,
      },
    },
  }),
  { name: 'AppShellHeader' },
)

export default function AppShellHeader(props: AppShellHeaderProps) {
  const {
    children,
    logo,
    divider,
    primary = null,
    secondary = null,
    hideClose,
    scrollY,
    additional,
    dragIndicator,
    scrolled,
    backFallbackHref,
    backFallbackTitle,
  } = props
  const router = usePageRouter()
  const { closeSteps, backSteps } = usePageContext()
  const classes = useStyles(props)

  const { titleRef, contentHeaderRef, isTransparent } = useAppShellHeaderContext()

  //  isTransparent = typeof children === 'undefined' || !children

  const sheetHeaderHeight = useMotionValue<number>(0)
  const titleOffset = useMotionValue<number>(100)
  const titleHeight = useMotionValue<number>(100)

  // Measure the title sizes so we can aimate the opacity
  useEffect(() => {
    if (!titleRef.current) return () => {}

    const ro = new ResizeObserver(([entry]) => {
      const { offsetTop, clientHeight } = entry.target as HTMLDivElement
      titleHeight.set(clientHeight)
      titleOffset.set(offsetTop)
    })

    ro.observe(titleRef.current)
    return () => ro.disconnect()
  }, [titleHeight, titleOffset, titleRef])

  // Measure the sheetHeight sizes so we can aimate the opacity
  useEffect(() => {
    if (!contentHeaderRef.current) return () => {}

    const ro = new ResizeObserver(([entry]) =>
      sheetHeaderHeight.set((entry.target as HTMLDivElement).clientHeight),
    )

    ro.observe(contentHeaderRef.current)
    return () => ro.disconnect()
  }, [contentHeaderRef, sheetHeaderHeight])

  const opacityFadeIn = useTransform(
    [scrollY, sheetHeaderHeight, titleOffset, titleHeight] as MotionValue[],
    ([scrollYV, sheetHeaderHeightV, titleOffsetV, titleHeigthV]: number[]) =>
      (scrollYV - titleOffsetV + sheetHeaderHeightV) / titleHeigthV,
  )
  const opacityFadeOut = useTransform(opacityFadeIn, [0, 1], [1, 0])

  const close =
    !hideClose &&
    (closeSteps > 0 ? (
      <Fab
        size='small'
        type='button'
        classes={{ root: classes.fab }}
        onClick={() => router.go(closeSteps * -1)}
      >
        <SvgImage src={iconClose} mobileSize={20} size={20} alt='Close overlay' loading='eager' />
      </Fab>
    ) : (
      <PageLink href='/' passHref>
        <Fab size='small' classes={{ root: classes.fab }}>
          <SvgImage src={iconClose} alt='Close overlay' size={20} mobileSize={20} loading='eager' />
        </Fab>
      </PageLink>
    ))

  const backIcon = (
    <SvgImage src={iconChevronLeft} alt='chevron back' loading='eager' size={26} mobileSize={30} />
  )
  let back = backSteps > 0 && (
    <Button
      onClick={() => router.back()}
      variant='pill-link'
      className={classes.backButton}
      startIcon={backIcon}
    >
      Back
    </Button>
  )
  if (!back && backFallbackHref) {
    back = (
      <PageLink href={backFallbackHref} passHref>
        <Button variant='pill-link' className={classes.backButton} startIcon={backIcon}>
          {backFallbackTitle ?? 'Back'}
        </Button>
      </PageLink>
    )
  }

  let leftAction: React.ReactNode = secondary ?? back
  const rightAction: React.ReactNode = primary ?? close
  if (rightAction !== close && !leftAction) leftAction = close
  if (!leftAction) leftAction = <div />

  return (
    <div
      className={clsx(
        classes?.sheetHeader,
        scrolled && classes?.sheetHeaderScrolled,
        !children && classes.sheetHeaderNoTitle,
      )}
      ref={contentHeaderRef}
    >
      <div className={classes.logoContainer}>
        {logo && (
          <m.div
            style={{ opacity: !scrolled ? opacityFadeOut : 0 }}
            className={clsx(classes.subLogo, classes.innerContainerItem)}
          >
            {logo}
          </m.div>
        )}
      </div>

      {dragIndicator}

      <div className={classes?.sheetHeaderActions}>
        {leftAction && <div>{leftAction}</div>}
        <div className={classes.innerContainer}>
          {children && (
            <m.div style={{ opacity: scrolled ? 1 : opacityFadeIn }} className={classes.childs}>
              {children}
            </m.div>
          )}
        </div>
        <div className={classes?.sheetHeaderActionRight}>{rightAction}</div>
      </div>
      {additional && <>{additional}</>}
      <div>
        {children &&
          (divider ?? (
            <m.div className={classes.divider} style={{ opacity: scrolled ? 1 : opacityFadeIn }} />
          ))}
      </div>
    </div>
  )
}
