import { usePageContext, usePageRouter } from '@reachdigital/framer-next-pages'
import {
  Sheet,
  SheetBackdrop,
  SheetContainer,
  SheetDragIndicator,
  SheetPanel,
  SheetProps,
  styles,
} from '@reachdigital/framer-sheet'
import { useRouter } from 'next/router'
import React from 'react'

export type SheetShellProps = {
  headerBack?: React.ReactNode
  cta?: React.ReactNode
  children?: React.ReactNode
} & Pick<SheetProps, 'size' | 'variant'>

function SheetShell(props: SheetShellProps) {
  const { children, headerBack, cta, variant, size } = props

  const router = useRouter()
  const pageRouter = usePageRouter()
  const { depth, backSteps } = usePageContext()
  const open = depth < 0 || router.asPath === pageRouter.asPath

  return (
    <Sheet
      open={open}
      onSnap={(snapPoint) => snapPoint === 'closed' && router.back()}
      variant={variant}
      size={size}
    >
      <SheetBackdrop onTap={() => pageRouter.go(backSteps * -1)} styles={styles} />
      <SheetContainer styles={styles}>
        <SheetPanel
          forward={cta}
          back={headerBack}
          header={<SheetDragIndicator styles={styles} />}
          styles={styles}
        >
          {backSteps > 1 && (
            <button type='button' onClick={() => pageRouter.go(-1)}>
              Back
            </button>
          )}
          {backSteps > 0 && (
            <button type='button' onClick={() => pageRouter.go(backSteps * -1)}>
              Close
            </button>
          )}
          {children}
        </SheetPanel>
      </SheetContainer>
    </Sheet>
  )
}

export default SheetShell
