import { makeStyles, Theme } from '@material-ui/core'
import { Image } from '@reachdigital/image'
import { UseStyles } from '@reachdigital/next-ui/Styles'
import PageLink from 'next/link'
import React from 'react'
import svgLogo from './graphcommerce.svg'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: 136,
      height: 16,
      pointerEvents: 'all',
      [theme.breakpoints.up('md')]: {
        width: 209,
        height: 25,
      },
    },
    link: {
      height: '100%',
      width: 'max-content',
      display: 'flex',
      margin: '0 auto',
      justifyContent: 'center',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        margin: 'unset',
        justifyContent: 'left',
      },
    },
  }),
  { name: 'Logo' },
)

type LogoProps = UseStyles<typeof useStyles>

export default function Logo(props: LogoProps) {
  const classes = useStyles(props)

  return (
    <PageLink href='/' passHref>
      <a className={classes.link}>
        <Image
          layout='fixed'
          alt='logo'
          src={svgLogo}
          unoptimized
          loading='eager'
          className={classes.logo}
        />
      </a>
    </PageLink>
  )
}
