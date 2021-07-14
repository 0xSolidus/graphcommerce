import { makeStyles, Theme } from '@material-ui/core'
import { m } from 'framer-motion'
import { UseStyles } from '../Styles'
import useDesktopNavActionsAnimation from './useDesktopNavActionsAnimation'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'fixed',
      top: 'unset',
      bottom: 20,
      right: 20,
      zIndex: 100,
      boxShadow: theme.shadows[4],
      borderRadius: 99,
      [theme.breakpoints.down('sm')]: {
        top: 'unset !important',
      },
      [theme.breakpoints.up('md')]: {
        top: 14,
        right: theme.page.horizontal,
        bottom: 'unset',
        boxShadow: 'unset',
      },
    },
  }),
  {
    name: 'FixedFab',
  },
)

type FixedFabProps = {
  children: React.ReactNode
} & UseStyles<typeof useStyles>

export default function FixedFab(props: FixedFabProps) {
  const { children } = props
  const classes = useStyles(props)
  const { translateY } = useDesktopNavActionsAnimation()

  return (
    <m.div style={{ top: translateY }} className={classes.root}>
      {children}
    </m.div>
  )
}
