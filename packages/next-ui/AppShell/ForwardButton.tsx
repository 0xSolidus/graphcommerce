import { ButtonProps, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import Button from '../Button'
import { UseStyles } from '../Styles'
import SvgImage from '../SvgImage'
import { iconChevronRight } from '../icons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: 'min-content',
      pointerEvents: 'all',
      [theme.breakpoints.down('sm')]: {
        height: 40,
        minWidth: 40,
        borderRadius: 20,
      },
      [theme.breakpoints.down('xs')]: {
        boxShadow: 'unset',
        paddingLeft: `12px`,
        paddingRight: `10px`,
      },
    },
    label: {
      whiteSpace: 'nowrap',
    },
    icon: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'unset',
      },
    },
    text: {
      pointerEvents: 'none',
    },
  }),
  { name: 'BackNavFab' },
)

export type BackButtonProps = UseStyles<typeof useStyles> & ButtonProps & { down?: boolean }

const ForwardButton = React.forwardRef((props: BackButtonProps, ref) => {
  const { text, icon, ...classes } = useStyles(props)
  const { children, down, ...fabProps } = props

  return (
    <Button variant='pill' classes={classes} {...fabProps}>
      <span className={text}>{children}</span>
      <SvgImage src={iconChevronRight} alt='chevron right' size='small' classes={{ root: icon }} />
    </Button>
  )
})
export default ForwardButton
