import React from 'react'
import { PageHeaderContainer, ButtonLink, ExternalLink } from '@pooltogether/react-components'
import Link from 'next/link'

const HEADER_LINK_CLASSES = 'mr-4 last:mr-0 text-base sm:text-lg'

export const PageHeader = (props) => (
  <PageHeaderContainer Link={Link} as='/' href='/'>
    <ExternalLink href='https://app.pooltogether.com/' className={HEADER_LINK_CLASSES}>
      Pools
    </ExternalLink>
    <ExternalLink href='https://app.pooltogether.com/account' className={HEADER_LINK_CLASSES}>
      Account
    </ExternalLink>
    <ExternalLink href='https://vote.pooltogether.com/' className={HEADER_LINK_CLASSES}>
      Vote
    </ExternalLink>
  </PageHeaderContainer>
)
