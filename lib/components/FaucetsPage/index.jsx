import React from 'react'

import { Meta } from 'lib/components/Meta'
import { Layout } from 'lib/components/Layout'
import { Nav } from 'lib/components/Layout/Nav'
import { TokenFaucetsCard } from 'lib/components/TreasuryPage/TokenFaucetsCard'

export const FaucetsPage = (props) => {
  return (
    <>
      <Meta title='Faucets' />
      <Layout>
        <Nav />

        <TokenFaucetsCard className='leading-none' />
      </Layout>
    </>
  )
}
