import { makeStyles, Theme, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginTop: theme.spacings.md,
      marginBottom: theme.spacings.sm,
      textAlign: 'center',
    },
  }),
  {
    name: 'NoSearchResults',
  },
)

export type NoSearchResultsProps = { search: string }

export default function NoSearchResults(props: NoSearchResultsProps) {
  const { search } = props
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography variant='h5' align='center'>
        We couldn&apos;t find any results for {`'${search}'`}
      </Typography>
      <p>Try a different search</p>
    </div>
  )
}
