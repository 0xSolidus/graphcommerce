import {
  Divider,
  Fab,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Menu,
  Theme,
} from '@material-ui/core'
import { m } from 'framer-motion'
import PageLink from 'next/link'
import { Router, useRouter } from 'next/router'
import React from 'react'
import { UseStyles } from '../Styles'
import responsiveVal from '../Styles/responsiveVal'
import SvgImage from '../SvgImage'
import { iconMenu } from '../icons'
import { MenuProps } from './Menu'
import useFabAnimation from './useFabAnimation'

const useStyles = makeStyles(
  (theme: Theme) => ({
    menuWrapper: {
      position: 'fixed',
      zIndex: 11,
      left: `calc(${theme.page.horizontal} + 10px)`,
      [theme.breakpoints.down('sm')]: {
        bottom: `calc(${theme.page.vertical} + 14px)`,
        transform: 'none !important',
        opacity: '1 !important',
      },
      [theme.breakpoints.up('md')]: {
        top: theme.page.vertical,
      },
    },
    menuFab: {
      background: theme.palette.text.primary,
      boxShadow: theme.shadows[2],
      width: responsiveVal(42, 56),
      height: responsiveVal(42, 56),
      '&:hover, &:focus': {
        background: theme.palette.text.primary,
      },
    },
    menu: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      minWidth: responsiveVal(200, 280),
    },
    menuItemText: {
      fontSize: '1.5em',
      fontWeight: 500,
      letterSpacing: '-0.0375em',
      lineHeight: 1,
    },
    menuItem: {},
  }),
  { name: 'Menu' },
)

export type MenuFabProps = MenuProps &
  UseStyles<typeof useStyles> & { children?: React.ReactNode; search?: React.ReactNode }

export default function MenuFab(props: MenuFabProps) {
  const { menu, children, search } = props
  const classes = useStyles(props)
  const router = useRouter()
  const [openEl, setOpenEl] = React.useState<null | HTMLElement>(null)

  const { filter, opacity, translateY } = useFabAnimation()

  Router.events.on('routeChangeStart', () => setOpenEl(null))

  return (
    <m.div className={classes.menuWrapper} style={{ opacity, translateY, filter }}>
      <Fab
        color='primary'
        aria-label='Open Menu'
        size='medium'
        onClick={(event) => setOpenEl(event.currentTarget)}
        className={classes.menuFab}
      >
        <SvgImage src={iconMenu} shade='inverted' alt='menu' size='small' loading='eager' />
      </Fab>

      <Menu
        anchorEl={openEl}
        open={!!openEl}
        onClose={() => setOpenEl(null)}
        classes={{ paper: classes.menu }}
        disableScrollLock
      >
        {search && (
          <List>
            <ListItem dense>{search}</ListItem>
          </List>
        )}
        <List>
          <PageLink href='/' passHref>
            <ListItem
              button
              dense
              selected={router.asPath === '/'}
              classes={{ root: classes.menuItem }}
            >
              <ListItemText classes={{ primary: classes.menuItemText }}>Home</ListItemText>
            </ListItem>
          </PageLink>

          {menu.map(({ href, children: itemChildren, ...linkProps }) => (
            <PageLink key={href.toString()} href={href} {...linkProps} passHref>
              <ListItem
                button
                dense
                selected={router.asPath.startsWith(href.toString())}
                classes={{ root: classes.menuItem }}
              >
                <ListItemText classes={{ primary: classes.menuItemText }}>
                  {itemChildren}
                </ListItemText>
              </ListItem>
            </PageLink>
          ))}
        </List>
        <Divider variant='middle' />
        <List>{children}</List>
      </Menu>
    </m.div>
  )
}
