import { TextField, Button, makeStyles, Theme, Link } from '@material-ui/core'
import { useMutationForm, emailPattern } from 'components/useMutationForm'
import { SignInDocument } from 'generated/apollo'
import NextLink from 'next/link'

const useStyles = makeStyles(
  (theme: Theme) => ({
    form: {
      display: 'grid',
      alignItems: 'center',
      // gridTemplateColumns: 'repeat(4, 1fr)',
      gridRowGap: theme.spacings.sm,
      gridColumnGap: theme.spacings.xs,
    },
    error: {
      color: theme.palette.error.main,
    },
    actions: {
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      paddingBottom: theme.spacings.xs,
      '& :last-child': {
        textAlign: 'right',
      },
    },
  }),
  { name: 'SignIn' },
)

export default function SignIn() {
  const classes = useStyles()
  const { register, errors, onSubmit, required, result } = useMutationForm<
    GQLSignInMutation,
    GQLSignInMutationVariables
  >({ mutation: SignInDocument })

  return (
    <form onSubmit={onSubmit} noValidate className={classes.form}>
      <TextField
        variant='filled'
        type='text'
        error={!!errors.email}
        id='email'
        name='email'
        label='Email'
        required={required.email}
        inputRef={register({
          required: required.email,
          pattern: { value: emailPattern, message: 'Invalid email address' },
        })}
        helperText={errors?.email?.message}
        disabled={result.loading}
      />
      <TextField
        variant='filled'
        type='password'
        error={!!errors.password}
        id='password'
        name='password'
        label='Password'
        required={required.password}
        inputRef={register({ required: required.password })}
        helperText={errors?.password?.message}
        disabled={result.loading}
      />

      <Button
        type='submit'
        disabled={result.loading}
        color='primary'
        variant='contained'
        className={classes.submit}
        size='large'
      >
        Log in
      </Button>

      {!result.loading && result.error?.message && (
        <div className={classes.error}>{result.error?.message}</div>
      )}

      <div className={classes.actions}>
        <NextLink href='/account/forgot' passHref>
          <Link>Forgot password?</Link>
        </NextLink>
        <NextLink href='/account/create' passHref>
          <Link>Create a new account?</Link>
        </NextLink>
      </div>
    </form>
  )
}
