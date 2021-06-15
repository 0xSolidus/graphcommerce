import { BaseTextFieldProps, FormHelperText, makeStyles, Theme } from '@material-ui/core'
import RenderType from '@reachdigital/next-ui/RenderType'
import SectionContainer from '@reachdigital/next-ui/SectionContainer'
import ToggleButton from '@reachdigital/next-ui/ToggleButton'
import ToggleButtonGroup from '@reachdigital/next-ui/ToggleButtonGroup'
import { Controller, FieldErrors, UseControllerProps } from '@reachdigital/react-hook-form'
import React from 'react'
import { Selected, useConfigurableContext } from '../ConfigurableContext'
import { SwatchTypeRenderer, SwatchSize } from '../Swatches'
import ColorSwatchData from '../Swatches/ColorSwatchData'
import ImageSwatchData from '../Swatches/ImageSwatchData'
import TextSwatchData from '../Swatches/TextSwatchData'

type ConfigurableOptionsProps = {
  sku: string
  errors?: FieldErrors
} & UseControllerProps<any> &
  Pick<BaseTextFieldProps, 'FormHelperTextProps' | 'helperText'> & {
    optionEndLabels?: Record<string, React.ReactNode>
  }

const useStyles = makeStyles(
  (theme: Theme) => ({
    labelInnerContainer: {
      borderBottom: 'none',
      padding: `${theme.spacings.md} 0`,
      [theme.breakpoints.up('md')]: {
        padding: `${theme.spacings.xs} 0`,
      },
    },
    toggleButtonGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacings.xxs,
    },
    button: {
      minHeight: theme.spacings.lg,
    },
  }),
  { name: 'ConfigurableOptions' },
)

const renderer: SwatchTypeRenderer = { TextSwatchData, ImageSwatchData, ColorSwatchData }

export default function ConfigurableOptionsInput(props: ConfigurableOptionsProps) {
  const {
    sku,
    FormHelperTextProps,
    name,
    defaultValue,
    errors,
    helperText,
    optionEndLabels,
    ...controlProps
  } = props

  const { options, selection, select, getVariants } = useConfigurableContext(sku)
  const classes = useStyles()

  return (
    <>
      {options?.map((option) => {
        if (!option?.uid || !option.attribute_code) return null

        const { attribute_code } = option
        const error = errors?.[attribute_code]

        return (
          <Controller
            key={option.uid}
            defaultValue={selection[attribute_code] ?? ''}
            name={`${name}[${attribute_code}]`}
            {...controlProps}
            render={({
              field: { onChange, value, name: inputName, ref, onBlur },
              fieldState: { error: errorHelperText },
            }) => (
              <SectionContainer
                label={`choose your ${option?.label}`}
                endLabel={
                  optionEndLabels && option?.label
                    ? optionEndLabels[option.label.toLowerCase()]
                    : undefined
                }
                classes={{
                  labelInnerContainer: classes.labelInnerContainer,
                }}
                borderBottom={false}
              >
                <ToggleButtonGroup
                  defaultValue={selection[attribute_code] ?? ''}
                  required
                  exclusive
                  minWidth={100}
                  onChange={(_, val: string | number) => {
                    onChange(val)
                    select((prev) => ({ ...prev, [attribute_code]: val } as Selected))
                  }}
                  ref={ref}
                  onBlur={onBlur}
                  value={value}
                  classes={{ root: classes.toggleButtonGroup }}
                >
                  {option?.values?.map((val) => {
                    if (!val?.swatch_data || !val.uid || !option.attribute_code) return null

                    const copySelection = { ...selection }
                    delete copySelection[attribute_code]

                    const itemVariant = getVariants(copySelection).find((variant) =>
                      variant?.attributes?.find((attribute) => attribute?.uid === val.uid),
                    )

                    return (
                      <ToggleButton
                        key={val.uid}
                        value={val.uid ?? ''}
                        name={inputName}
                        className={classes.button}
                      >
                        <RenderType
                          renderer={renderer}
                          {...val}
                          {...val.swatch_data}
                          price={itemVariant?.product?.price_range.minimum_price.final_price}
                          size={'large' as SwatchSize}
                        />
                      </ToggleButton>
                    )
                  })}
                </ToggleButtonGroup>
                {error && (
                  <FormHelperText error {...FormHelperTextProps}>
                    {`${option.label} is ${errorHelperText?.type}`}
                  </FormHelperText>
                )}
              </SectionContainer>
            )}
          />
        )
      })}
    </>
  )
}
