import React from 'react'
import Link from 'next/link'
import { PageHeaderContainer } from '@pooltogether/react-components'

const HEADER_LINK_CLASSES = 'mr-4 last:mr-0 text-sm sm:text-lg hover:text-green'

export const PageHeader = (props) => (
  <PageHeaderContainer Link={Link} as='/' href='/'>
    <a href='https://app.pooltogether.com/' className={HEADER_LINK_CLASSES}>
      Pools
    </a>
    <a href='https://app.pooltogether.com/account' className={HEADER_LINK_CLASSES}>
      Account
    </a>
    <a href='https://vote.pooltogether.com/' className={HEADER_LINK_CLASSES}>
      Vote
    </a>
  </PageHeaderContainer>
)
