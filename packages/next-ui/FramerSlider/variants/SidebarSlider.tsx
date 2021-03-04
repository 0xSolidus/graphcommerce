import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { ReactNode } from 'react'
import { UseStyles } from '../../Styles'
import responsiveVal from '../../Styles/responsiveVal'
import SliderContainer from '../SliderContainer'
import { SliderContext } from '../SliderContext'
import SliderPageCounter from '../SliderPageCounter'
import SliderScroller from '../SliderScroller'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'grid',
      gridTemplateColumns: '25% 75%',
      maxWidth: '100%',
      marginBottom: `${theme.spacings.xl}`,
    },
    sidebar: {
      display: 'grid',
      alignContent: 'space-between',
      padding: `0 ${theme.spacings.lg} 0 ${theme.page.horizontal}`,
    },
    h2: {
      ...theme.typography.h1,
      fontSize: responsiveVal(16, 40),
    },
    scroller: {
      gridColumnGap: theme.spacings.md,
      gridRowGap: theme.spacings.lg,
      alignContent: 'space-around',
      paddingRight: theme.page.horizontal,
    },
    item: {
      minWidth: responsiveVal(200, 400),
    },
  }),
  { name: 'RowProductRelated' },
)

type SidebarSliderProps = { children: ReactNode; sidebar: ReactNode } & UseStyles<typeof useStyles>

export default function SidebarSlider(props: SidebarSliderProps) {
  const { children, sidebar } = props
  const classes = useStyles()

  return (
    <SliderContext scrollSnapAlign='start'>
      <div className={classes.root}>
        <div className={classes.sidebar}>
          <div>{sidebar}</div>
          <SliderPageCounter count={React.Children.count(children)} />
        </div>

        <SliderContainer>
          <SliderScroller classes={{ scroller: classes.scroller }}>{children}</SliderScroller>
        </SliderContainer>
      </div>
    </SliderContext>
  )
}
