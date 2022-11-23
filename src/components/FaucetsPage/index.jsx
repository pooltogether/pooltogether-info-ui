import React from 'react'

import { Meta } from '@components/Meta'
import { Layout } from '@components/Layout'
import { TokenFaucetsCard } from '@components/TreasuryPage/TokenFaucetsCard'

export const FaucetsPage = (props) => {
  return (
    <>
      <Meta title='Faucets' />
      <TokenFaucetsCard className='leading-none' />
    </>
  )
}
