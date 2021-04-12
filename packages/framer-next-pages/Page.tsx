import { useIsPresent } from 'framer-motion'
import React from 'react'
import type { PageItem } from './types'
import { currentHistoryIdx, scrollPos } from './utils'

export type PageProps = Pick<PageItem, 'historyIdx'> & {
  active: boolean
  children: React.ReactNode
}

export default function Page(props: PageProps) {
  const { active, historyIdx, children } = props
  const isPresent = useIsPresent()

  /** The active Page doesn't get any special treatment */
  let top = 0

  /** If the Page isn't active, we offset the page */
  if (!active) top = scrollPos(historyIdx).y * -1

  /**
   * If the Page isn't present as a child of <AnimatePresence/>, but it is still present in the DOM,
   * we're navigating back, so we need to offset it.
   */
  if (!isPresent) top = scrollPos(currentHistoryIdx()).y - scrollPos(historyIdx).y

  const activePresent = active && isPresent
  const position = activePresent ? 'absolute' : 'fixed'
  const pointerEvents = activePresent ? undefined : 'none'

  return (
    <div style={{ position, top, left: 0, right: 0, pointerEvents, minHeight: '100%' }}>
      {children}
    </div>
  )
}
