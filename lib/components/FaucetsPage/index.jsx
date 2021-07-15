import React from 'react'

import { Layout } from 'lib/components/Layout'
import { Nav } from 'lib/components/Layout/Nav'
import { TokenFaucetsCard } from 'lib/components/TreasuryPage/TokenFaucetsCard'

export const FaucetsPage = (props) => {
  return (
    <Layout>
      <Nav />

      <TokenFaucetsCard className='leading-none' />
    </Layout>
  )
}
