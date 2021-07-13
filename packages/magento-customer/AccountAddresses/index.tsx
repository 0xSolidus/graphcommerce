import { makeStyles, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import {
  NextButton as Button,
  FullPageMessage,
  SectionContainer,
  MessageSnackbar,
  SvgImage,
  iconHome,
} from '@reachdigital/next-ui'
import { useRouter } from 'next/router'
import React from 'react'
import AccountAddress from '../AccountAddress'
import { AccountAddressesFragment } from './AccountAddresses.gql'

export type AccountAddressesProps = AccountAddressesFragment & { loading: boolean }

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '& > div': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
    sectionContainer: {
      position: 'absolute',
    },
    button: {
      display: 'block',
      maxWidth: 'max-content',
      margin: `${theme.spacings.md} auto`,
      padding: `${theme.spacings.xxs} ${theme.spacings.md}`,
    },
    link: {
      textDecoration: 'none',
    },
  }),
  { name: 'AccountAddresses' },
)

export default function AccountAddresses(props: AccountAddressesProps) {
  const { addresses, loading } = props
  const classes = useStyles()
  const router = useRouter()

  if (loading) {
    return (
      <SectionContainer labelLeft='Shipping addresses'>
        <div className={classes.root}>
          <Skeleton height={128} />
          <Skeleton height={128} />
          <Skeleton height={128} />
        </div>
        <Button className={classes.button} variant='contained' color='primary' text='bold' disabled>
          Add new address
        </Button>
      </SectionContainer>
    )
  }

  return (
    <>
      {((addresses && addresses.length === 0) || !addresses) && (
        <>
          <FullPageMessage
            title='You have no addresses saved yet'
            icon={<SvgImage src={iconHome} size={148} alt='home' />}
            button={
              <Button
                size='large'
                variant='contained'
                color='primary'
                text='bold'
                href='/account/addresses/add'
              >
                Add new address
              </Button>
            }
          />
        </>
      )}

      {addresses && addresses.length > 1 && (
        <SectionContainer labelRight='Shipping addresses'>
          <div className={classes.root}>
            {addresses?.map((address) => (
              <AccountAddress key={address?.id} {...address} />
            ))}
          </div>

          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            text='bold'
            href='/account/addresses/add'
          >
            Add new address
          </Button>

          <MessageSnackbar sticky open={router.query.confirm_delete !== undefined}>
            <>Address was deleted</>
          </MessageSnackbar>
        </SectionContainer>
      )}
    </>
  )
}
