import { Scroller, useScrollerContext, useScrollTo } from '@graphcommerce/framer-scroller'
import { dvh, dvw, useConstant, useIsomorphicLayoutEffect } from '@graphcommerce/framer-utils'
import { Box, styled, SxProps, Theme, useTheme, useThemeProps } from '@mui/material'
import {
  m,
  MotionProps,
  motionValue,
  useDomEvent,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import framesync from 'framesync'
import React, { useCallback, useEffect, useRef } from 'react'
import { LayoutProvider } from '../../Layout/components/LayoutProvider'
import { ExtendableComponent, extendableComponent } from '../../Styles'
import { useMatchMedia } from '../../hooks/useMatchMedia'

export type LayoutOverlayVariant = 'left' | 'bottom' | 'right'
export type LayoutOverlaySize = 'floating' | 'minimal' | 'full'
export type LayoutOverlayAlign = 'start' | 'end' | 'center' | 'stretch'

type StyleProps = {
  variantSm: LayoutOverlayVariant
  variantMd: LayoutOverlayVariant
  sizeSm?: LayoutOverlaySize
  sizeMd?: LayoutOverlaySize
  justifySm?: LayoutOverlayAlign
  justifyMd?: LayoutOverlayAlign
}

type OverridableProps = {
  mdSpacingTop?: (theme: Theme) => string
  smSpacingTop?: (theme: Theme) => string
}

export type LayoutOverlayBaseProps = {
  children?: React.ReactNode | (() => React.ReactNode)
  className?: string
  sx?: SxProps<Theme>
  sxBackdrop?: SxProps<Theme>
  active: boolean
  direction?: 1 | -1
  onClosed: () => void
  offsetPageY?: number
  isPresent: boolean
  safeToRemove?: (() => void) | null | undefined
  overlayPaneProps?: MotionProps

  /* For `variantSm='left|right' */
  widthSm?: string | false

  /* For `variantMd='left|right' */
  widthMd?: string | false
} & StyleProps &
  OverridableProps

enum OverlayPosition {
  UNOPENED = -1,
  OPENED = 1,
  CLOSED = 0,
}

const name = 'LayoutOverlayBase' as const
const parts = ['scroller', 'backdrop', 'overlay', 'overlayPane', 'beforeOverlay'] as const
const { withState } = extendableComponent<StyleProps, typeof name, typeof parts>(name, parts)

/** Expose the component to be exendable in your theme.components */
declare module '@mui/material/styles/components' {
  interface Components {
    LayoutOverlayBase?: Pick<ExtendableComponent<OverridableProps & StyleProps>, 'defaultProps'>
  }
}

const MotionDiv = styled(m.div)({})

const clearScrollLock = () => {
  document.body.style.overflow = ''
}

export function OverlayBase(incomingProps: LayoutOverlayBaseProps) {
  const props = useThemeProps({ name, props: incomingProps })

  const {
    children,
    variantSm,
    variantMd,
    className,
    sizeSm = 'full',
    sizeMd = 'full',
    justifySm = 'stretch',
    justifyMd = 'stretch',
    sx = [],
    sxBackdrop = [],
    active,
    onClosed,
    direction = 1,
    offsetPageY = 0,
    isPresent,
    safeToRemove,
    overlayPaneProps,
    widthMd = 'max(800px, 50vw)',
    widthSm = 'max(300px, 80vw)',
  } = props

  const th = useTheme()
  const mdSpacingTop = (
    props.mdSpacingTop ?? ((theme) => `calc(${theme.appShell.headerHeightMd} * 0.5)`)
  )(th)
  const smSpacingTop = (
    props.smSpacingTop ?? ((theme) => `calc(${theme.appShell.headerHeightSm} * 0.5)`)
  )(th)

  const { scrollerRef, snap, scroll, getScrollSnapPositions } = useScrollerContext()
  const scrollTo = useScrollTo()
  const beforeRef = useRef<HTMLDivElement>(null)

  const position = useMotionValue<OverlayPosition>(OverlayPosition.UNOPENED)

  const classes = withState({ variantSm, variantMd, sizeSm, sizeMd, justifySm, justifyMd })

  const overlayRef = useRef<HTMLDivElement>(null)

  const match = useMatchMedia()
  const positions = useConstant(() => ({
    open: { x: motionValue(0), y: motionValue(0), visible: motionValue(0) },
    closed: { x: motionValue(0), y: motionValue(0) },
  }))

  const variant = useCallback(
    () => (match.up('md') ? variantMd : variantSm),
    [match, variantMd, variantSm],
  )
  const prevVariant = useRef<LayoutOverlayVariant>()

  useIsomorphicLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return () => {}

    const handleSizing = () => {
      const snapPositions = getScrollSnapPositions()
      const x = snapPositions.x[snapPositions.x.length - 1]
      const y = snapPositions.y[snapPositions.y.length - 1]

      const clampRound = (value: number) => Math.round(Math.max(0, Math.min(1, value)) * 100) / 100

      const scrollX = scroller.scrollLeft || scroll.x.get()
      const scrolly = scroller.scrollTop || scroll.y.get()

      if (variant() === 'left') {
        positions.closed.x.set(x)
        positions.open.x.set(0)
      }
      if (variant() === 'right') {
        positions.open.x.set(x)
        positions.closed.x.set(0)
      }
      if (variant() === 'bottom') {
        positions.open.y.set(y)
        positions.closed.y.set(0)
      }

      // if (!prevVariant.current) prevVariant.current = variant()
      if (prevVariant.current !== variant()) {
        // Set the initial position of the overlay.
        // Make sure the overlay stays open when the variant changes.
        if (position.get() !== OverlayPosition.OPENED) {
          scroller.scrollLeft = positions.closed.x.get()
          scroller.scrollTop = positions.closed.y.get()
        } else {
          scroller.scrollLeft = positions.open.x.get()
          scroller.scrollTop = positions.open.y.get()
        }
        prevVariant.current = variant()
      } else {
        // When we're not switching variants, we update the vibility of the overlay.
        if (variant() === 'left') {
          const closedX = snapPositions.x[1] ?? 0
          if (!scroller.className.includes('Navigation')) {
            console.log('closedX', scrollX, closedX, (scrollX - closedX) / -closedX)
          }
          positions.open.visible.set(closedX === 0 ? 0 : clampRound((scrollX - closedX) / -closedX))
        }

        if (variant() === 'right') {
          const openedX = snapPositions.x[1] ?? 0
          positions.open.visible.set(openedX === 0 ? 0 : clampRound(scrollX / openedX))
        }

        if (variant() === 'bottom') {
          const openedY = snapPositions.y[1] ?? 0
          positions.open.visible.set(openedY === 0 ? 0 : clampRound(scrolly / openedY))
        }
      }

      if (!scroller.className.includes('Navigation')) {
        console.log(variant(), positions.open.visible.get())
      }
    }

    const measureTimed = () => framesync.read(handleSizing)
    handleSizing()

    const cancelX = scroll.x.onChange(measureTimed)
    const cancelY = scroll.y.onChange(measureTimed)

    const ro = new ResizeObserver(measureTimed)
    ro.observe(scrollerRef.current)
    ;[...scrollerRef.current.children].forEach((child) => ro.observe(child))

    window.addEventListener('resize', measureTimed)
    return () => {
      window.removeEventListener('resize', measureTimed)
      ro.disconnect()
      cancelX()
      cancelY()
    }
  }, [getScrollSnapPositions, position, positions, scroll, scrollerRef, variant])

  // When the component is mounted, we need to set the initial position of the overlay.
  useIsomorphicLayoutEffect(() => {
    const scroller = scrollerRef.current

    if (!scroller || !isPresent) return undefined

    const open = { x: positions.open.x.get(), y: positions.open.y.get() }

    document.body.style.overflow = 'hidden'

    if (position.get() !== OverlayPosition.OPENED) {
      if (direction === 1) {
        scroller.scrollLeft = positions.closed.x.get()
        scroller.scrollTop = positions.closed.y.get()
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        scrollTo(open).then(() => {
          scroller.scrollLeft = positions.open.x.get()
          scroller.scrollTop = positions.open.y.get()
          position.set(OverlayPosition.OPENED)
        })
      } else {
        scroller.scrollLeft = open.x
        scroller.scrollTop = open.y
        position.set(OverlayPosition.OPENED)
        snap.set(true)
      }
    }

    return clearScrollLock
  }, [direction, isPresent, position, positions, scrollTo, scrollerRef, snap])

  // When the overlay is closed by navigating away, we're closing the overlay.
  useEffect(() => {
    const scroller = scrollerRef.current
    if (isPresent || !scroller) return

    if (position.get() === OverlayPosition.UNOPENED) {
      position.set(OverlayPosition.CLOSED)
      clearScrollLock()
      scroller.scrollLeft = positions.closed.x.get()
      scroller.scrollTop = positions.closed.y.get()
      safeToRemove?.()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      scrollTo({
        x: positions.closed.x.get(),
        y: positions.closed.y.get(),
      }).then(() => safeToRemove?.())
    }
  }, [isPresent, position, positions, safeToRemove, scrollTo, scrollerRef])

  // Only go back to a previous page if the overlay isn't closed.
  const closeOverlay = useCallback(() => {
    if (position.get() !== OverlayPosition.OPENED) return
    position.set(OverlayPosition.CLOSED)
    clearScrollLock()
    onClosed()
  }, [onClosed, position])

  // Handle escape key
  const windowRef = useRef(typeof window !== 'undefined' ? window : null)
  const handleEscape = (e: KeyboardEvent | Event) => {
    if (active && (e as KeyboardEvent)?.key === 'Escape') closeOverlay()
  }
  useDomEvent(windowRef, 'keyup', handleEscape, { passive: true })

  // When the overlay isn't visible anymore, we navigate back.
  useEffect(
    () => positions.open.visible.onChange((o) => o === 0 && closeOverlay()),
    [closeOverlay, position, positions.open.visible],
  )

  // Measure the offset of the overlay in the scroller.
  const offsetY = useMotionValue(0)
  useEffect(() => {
    if (!overlayRef.current) return () => {}
    const ro = new ResizeObserver(([entry]) => offsetY.set(entry.contentRect.top))
    ro.observe(overlayRef.current)
    return () => ro.disconnect()
  }, [offsetY])

  // Create the exact position for the LayoutProvider which offsets the top of the overlay
  const scrollYOffset = useTransform(
    [scroll.y, positions.open.y],
    ([y, openY]: number[]) => y - openY + offsetPageY,
  )

  const onClickAway = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const isTarget =
        event.target === scrollerRef.current ||
        event.target === beforeRef.current ||
        event.target === overlayRef.current
      if (isTarget && snap.get()) closeOverlay()
    },
    [closeOverlay, scrollerRef, snap],
  )

  return (
    <>
      <MotionDiv
        inert={active ? undefined : 'true'}
        className={classes.backdrop}
        style={{ opacity: positions.open.visible }}
        sx={[
          {
            zIndex: -1,
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            WebkitTapHighlightColor: 'transparent',
            willChange: 'opacity',
          },
          ...(Array.isArray(sxBackdrop) ? sxBackdrop : [sxBackdrop]),
        ]}
      />
      <Scroller
        inert={active ? undefined : 'true'}
        className={`${classes.scroller} ${className ?? ''}`}
        grid={false}
        onClick={onClickAway}
        sx={[
          (theme) => ({
            overscrollBehavior: 'contain',
            display: 'grid',
            '&.canGrab': {
              cursor: 'default',
            },
            '&.mdSnapDirInline': {
              overflow: 'auto',
            },

            height: dvh(100),

            [theme.breakpoints.down('md')]: {
              '&.variantSmLeft': {
                gridTemplate: `"overlay beforeOverlay"`,
                borderTopRightRadius: theme.shape.borderRadius * 3,
                borderBottomRightRadius: theme.shape.borderRadius * 3,
              },
              '&.variantSmRight': {
                gridTemplate: `"beforeOverlay overlay"`,
                borderTopLeftRadius: theme.shape.borderRadius * 3,
                borderBottomLeftRadius: theme.shape.borderRadius * 3,
              },
              '&.variantSmBottom': {
                borderTopLeftRadius: theme.shape.borderRadius * 3,
                borderTopRightRadius: theme.shape.borderRadius * 3,
                gridTemplate: `"beforeOverlay" "overlay"`,
                height: `calc(${dvh(100)} - 1px)`,

                '&::after': {
                  content: `""`,
                  display: 'block',
                  position: 'absolute',
                  width: '100%',
                  height: '1px',
                  top: 'calc(100% - 1px)',
                  left: '0',
                  background: theme.palette.background.paper,
                },
              },
            },
            [theme.breakpoints.up('md')]: {
              '&.variantMdLeft': {
                gridTemplate: `"overlay beforeOverlay"`,
                borderTopRightRadius: theme.shape.borderRadius * 4,
                borderBottomRightRadius: theme.shape.borderRadius * 4,

                '&::-webkit-scrollbar': { display: 'none' },
              },
              '&.variantMdRight': {
                gridTemplate: `"beforeOverlay overlay"`,
                borderTopLeftRadius: theme.shape.borderRadius * 4,
                borderBottomLeftRadius: theme.shape.borderRadius * 4,

                '&::-webkit-scrollbar': { display: 'none' },
              },
              '&.variantMdBottom': {
                borderTopLeftRadius: theme.shape.borderRadius * 4,
                borderTopRightRadius: theme.shape.borderRadius * 4,
                [theme.breakpoints.up('md')]: {
                  gridTemplate: `"beforeOverlay" "overlay"`,
                  height: dvh(100),
                },
              },
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <Box
          onClick={onClickAway}
          className={classes.beforeOverlay}
          ref={beforeRef}
          sx={(theme) => ({
            gridArea: 'beforeOverlay',
            scrollSnapAlign: 'start',
            display: 'grid',
            alignContent: 'end',

            [theme.breakpoints.down('md')]: {
              '&.variantSmLeft, &.variantSmRight': {
                width: dvw(100),
              },
              '&.variantSmBottom': {
                height: dvh(100),
              },
            },
            [theme.breakpoints.up('md')]: {
              '&.variantMdLeft, &.variantMdRight': {
                width: dvw(100),
              },
              '&.variantMdBottom': {
                height: dvh(100),
              },
            },
          })}
        />
        <Box
          className={classes.overlay}
          ref={overlayRef}
          onClick={onClickAway}
          sx={(theme) => ({
            display: 'grid',
            gridArea: 'overlay',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            [theme.breakpoints.down('md')]: {
              justifyContent: justifySm,
              alignItems: justifySm,

              '&.variantSmBottom': {
                marginTop: `calc(${smSpacingTop} * -1)`,
                paddingTop: smSpacingTop,
              },
              '&.sizeSmFloating': {
                padding: `${theme.page.vertical} ${theme.page.horizontal}`,
              },
            },
            [theme.breakpoints.up('md')]: {
              justifyContent: justifyMd,
              alignItems: justifyMd,

              '&.variantMdBottom': {
                paddingTop: mdSpacingTop,
                marginTop: `calc(${mdSpacingTop} * -1)`,
                display: 'grid',
              },
              '&.sizeMdFloating': {
                padding: `${theme.page.vertical} ${theme.page.horizontal}`,
              },
              '&.sizeMdFloating.variantMdBottom': {
                marginTop: `calc(${theme.page.vertical} * -1)`,
              },
            },
          })}
        >
          <MotionDiv
            {...overlayPaneProps}
            className={classes.overlayPane}
            sx={(theme) => ({
              pointerEvents: 'all',
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[24],

              [theme.breakpoints.down('md')]: {
                minWidth: '80vw',
                '&:not(.sizeSmFull)': {
                  width: 'auto',
                },

                '&.variantSmBottom.sizeSmFull': {
                  minHeight: `calc(${dvh(100)} - ${smSpacingTop})`,
                },

                '&.variantSmBottom': {
                  borderTopLeftRadius: `${theme.shape.borderRadius * 3}px`,
                  borderTopRightRadius: `${theme.shape.borderRadius * 3}px`,
                },
                '&.sizeSmFloating': {
                  borderRadius: `${theme.shape.borderRadius * 3}px`,
                },
                '&.variantSmLeft.sizeSmFull': {
                  paddingBottom: '1px',
                  minHeight: dvh(100),
                },
                '&.variantSmRight.sizeSmFull': {
                  paddingBottom: '1px',
                  minHeight: dvh(100),
                },
                '&.variantSmLeft, &.variantSmRight': {
                  width: widthSm || undefined,
                  maxWidth: dvw(100),
                },
              },
              [theme.breakpoints.up('md')]: {
                minWidth: '1px',

                '&.sizeMdFull.variantMdBottom': {
                  minHeight: `calc(${dvh(100)} - ${mdSpacingTop})`,
                },
                '&.sizeMdFull.variantMdLeft': {
                  paddingBottom: '1px',
                  minHeight: dvh(100),
                },
                '&.sizeMdFull.variantMdRight': {
                  paddingBottom: '1px',
                  minHeight: dvh(100),
                },

                '&.variantMdBottom': {
                  borderTopLeftRadius: `${theme.shape.borderRadius * 4}px`,
                  borderTopRightRadius: `${theme.shape.borderRadius * 4}px`,
                },
                '&.variantMdLeft, &.variantMdRight': {
                  width: widthMd || 'max-content',
                  maxWidth: dvw(100),
                },

                '&.variantMdBottom.sizeMdFloating': {
                  width: widthMd,
                },

                '&.sizeMdFloating': {
                  borderRadius: `${theme.shape.borderRadius * 4}px`,
                },
              },
            })}
          >
            <LayoutProvider scroll={scrollYOffset}>
              {typeof children === 'function' ? active && children() : children}
            </LayoutProvider>
          </MotionDiv>
        </Box>
      </Scroller>
    </>
  )
}
