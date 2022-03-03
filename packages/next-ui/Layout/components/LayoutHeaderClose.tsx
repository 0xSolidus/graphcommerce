import { useGo, usePageContext } from '@graphcommerce/framer-next-pages'
import { Trans } from '@lingui/macro'
import { LinkOrButton } from '../../Button/LinkOrButton'
import { IconSvg } from '../../IconSvg'
import { iconClose } from '../../icons'

export function useShowClose() {
  const { overlayGroup } = usePageContext()
  return !!overlayGroup
}

export default function LayoutHeaderClose() {
  const { closeSteps } = usePageContext()
  const onClick = useGo(closeSteps * -1)

  return (
    <LinkOrButton
      button={{ type: 'button', variant: 'pill' }}
      color='inherit'
      onClick={onClick}
      aria-label='Close'
      startIcon={<IconSvg src={iconClose} />}
      // className={classes.close}
    >
      <Trans>Close</Trans>
    </LinkOrButton>
  )
}
