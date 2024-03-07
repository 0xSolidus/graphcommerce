import { BreadcrumbsProps as BreadcrumbsPropsBase, LinkProps } from '@mui/material'

export type BreadcrumbsProps = {
  breadcrumbs: Pick<LinkProps, 'underline' | 'key' | 'color' | 'href' | 'children'>[]
  name?: string | null
  numOfBreadcrumbsToShow?: number
} & Omit<BreadcrumbsPropsBase, 'children'>
