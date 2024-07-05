import { globalFormContextRef } from '@graphcommerce/magento-product'
import {
  Button,
  IconSvg,
  extendableComponent,
  iconClose,
  iconSearch,
  showPageLoadIndicator,
} from '@graphcommerce/next-ui'
import {
  Fab,
  FabProps,
  FormControl,
  FormControlProps,
  IconButton,
  OutlinedInput,
  OutlinedInputProps,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

type ProductFiltersProSearchFieldProps = FormControlProps & {
  fab?: FabProps
  input?: OutlinedInputProps
}

const name = 'ProductFiltersProSearchField' as const
const slotNames = ['root', 'input', 'fab'] as const
type StyleProps = { visible: boolean; searchPage: boolean }

const { withState } = extendableComponent<StyleProps, typeof name, typeof slotNames>(
  name,
  slotNames,
)

export function ProductFiltersProSearchField(props: ProductFiltersProSearchFieldProps) {
  const { input, fab, ...rest } = props

  const router = useRouter()

  const searchPage = router.asPath.startsWith('/search')
  const [expanded, setExpanded] = useState(searchPage)
  useMemo(() => setExpanded(searchPage), [searchPage])

  const searchTerm = searchPage ? `${router.query.url?.[0]}` : ''

  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    // When the user is not focussed on the search field and the value gets update the form.
    if (ref.current && ref.current !== document.activeElement) ref.current.value = searchTerm
  }, [searchTerm])

  const visible = expanded || searchPage
  const classes = withState({ visible, searchPage })

  return (
    <>
      <FormControl
        className={classes.root}
        variant='outlined'
        {...rest}
        sx={[
          (theme) => ({
            [theme.breakpoints.between('xs', 'lg')]: {
              '&:not(.visible)': {
                opacity: 0,
                width: 'min-content',
              },
              '&.visible': {
                opacity: 1,
                width: '400px',
              },
            },
            [theme.breakpoints.up('lg')]: {
              opacity: 1,
              width: '400px',
            },
          }),
          ...(Array.isArray(rest.sx) ? rest.sx : [rest.sx]),
        ]}
      >
        <OutlinedInput
          fullWidth
          type='text'
          name='search'
          color='primary'
          className={classes.input}
          onChange={(e) => {
            const context = globalFormContextRef.current

            // When we're not on the search page, we want to navigate as soon as possible.
            // We only want to navigate once, and let the rest be handled by the search page.
            if (!context || !searchPage) {
              return router.push(`/search/${e.target.value}`)
            }

            context.form.setValue('currentPage', 1)
            context.form.setValue('search', e.target.value)
            return context.submit()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const context = globalFormContextRef.current
              if (!context) return undefined
              context.form.setValue('currentPage', 1)
              context.form.setValue('search', e.currentTarget.value)
              return context.submit()
            }
          }}
          {...input}
          onBlur={() => {
            if (!searchPage && !showPageLoadIndicator.get()) setExpanded(false)
          }}
          placeholder='Search for products...'
          endAdornment={
            <>
              {/* <Button
              color='primary'
              variant='text'
              onClick={() => {
                const context = globalFormContextRef.current
                if (ref.current) ref.current.value = ''
                if (!context) return undefined
                context.form.setValue('currentPage', 1)
                context.form.setValue('search', '')
                return context.submit()
              }}
            >
              Reset
            </Button> */}
              <IconButton
                color='inherit'
                size='small'
                sx={{
                  display: {
                    lg: 'none',
                  },
                }}
                onClick={() => {
                  setExpanded(false)
                  // if (searchPage) router.back()
                }}
              >
                <IconSvg src={iconClose} size='large' />
              </IconButton>
            </>
          }
          inputRef={ref}
          sx={[
            (theme) => ({
              // bgcolor: 'background.paper',
              // borderRadius: '100px',

              // borderRadius: theme.shape.borderRadius * 6,

              // pl: 2,
              // pr: '5px',
              // py: 1,
              // py: 1,
              // '& .MuiInputBase-root.MuiOutlinedInput-root': {
              //   typography: 'body1',
              //   whiteSpace: 'nowrap',
              //   border: `2px solid ${theme.palette.primary.main}`,
              //   borderRadius: theme.shape.borderRadius * 6,
              //   boxShadow: theme.shadows[3],
              // },
              // '& .MuiInputBase-input': { pl: 3 },
              '& fieldset': {
                // borderRadius: theme.shape.borderRadius,
                // boxShadow: theme.shadows[1],
                // borderColor: theme.palette.background.paper,
                // border: 'none',
              },
              // '& .MuiFormControl-root': { px: 0 },
              // '& use': { stroke: theme.palette.text.primary },
            }),
          ]}
        />
      </FormControl>
      <Fab
        className={classes.fab}
        onClick={() => {
          setExpanded(true)
          ref.current?.focus()
        }}
        color='inherit'
        size='large'
        {...fab}
        sx={[
          {
            display: {
              xs: visible ? 'none' : 'inline-flex',
              lg: 'none',
            },
          },
          ...(Array.isArray(fab?.sx) ? fab.sx : [fab?.sx]),
        ]}
      >
        <IconSvg src={iconSearch} size='large' />
      </Fab>
    </>
  )
}
