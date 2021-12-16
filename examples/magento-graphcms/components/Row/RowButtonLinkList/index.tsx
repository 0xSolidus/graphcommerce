import { ButtonLinkListItem, ButtonLinkList } from '@graphcommerce/next-ui'
import React from 'react'
import { RowButtonLinkListFragment } from './RowButtonLinkList.gql'

export type RowButtonLinkListProps = RowButtonLinkListFragment

export default function RowButtonLinkList(props: RowButtonLinkListProps) {
  const { title, links } = props

  const isBig = links.some((link) => (link.title?.length ?? 0) > 30)
  return (
    <ButtonLinkList title={title} containsBigLinks={isBig}>
      {links?.map((link) => (
        <ButtonLinkListItem key={link.url} url={`/${link.url}`}>
          {link.title}
        </ButtonLinkListItem>
      ))}
    </ButtonLinkList>
  )
}
