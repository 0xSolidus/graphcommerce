import { makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { m } from 'framer-motion'
import { UseStyles } from '../Styles'
import ShellBase, { PageLayoutBaseProps } from './ShellBase'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: -8,
      [theme.breakpoints.up('md')]: {
        padding: `${theme.page.vertical}px ${theme.page.horizontal}px ${theme.page.vertical}px`,
        marginBottom: -12,
        top: 0,
        display: 'flex',
        pointerEvents: 'none',
        alignItems: 'left',
        justifyContent: 'left',
        width: '100%',
      },
    },
  }),
  { name: 'FullPageShellBase' },
)

export type FullPageShellBaseProps = {
  header?: React.ReactNode
  children?: React.ReactNode
  backFallbackHref?: string | null
  backFallbackTitle?: string | null
} & UseStyles<typeof useStyles> &
  PageLayoutBaseProps

export default function FullPageShellBase(props: FullPageShellBaseProps) {
  const { children, header, name } = props
  const classes = useStyles(props)

  return (
    <ShellBase name={name}>
      <m.header
        className={clsx(classes.header)}
        layoutId='header'
        transition={{ type: 'tween' }}
        layout='position'
      >
        {header}
      </m.header>
      {children}
    </ShellBase>
  )
}
